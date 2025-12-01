import axios from 'axios';
import Game from '../models/games.js';
import debug from 'debug';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const logger = debug('back:api:internet-games');

// Récupération des clés d'API depuis les variables d'environnement
const IGDB_URL = 'https://api.igdb.com/v4/games';
const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

const HEADERS = {
  'Client-ID': CLIENT_ID,
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
};

/**
 * Récupère les jeux depuis l'API IGDB avec une pagination.
 * @param {number} offset - Décalage des résultats pour la pagination.
 * @param {number} limit - Nombre de jeux à récupérer.
 * @returns {Array|null} Liste des jeux ou null en cas d'erreur.
 */
export const fetchGames = async (offset = 0, limit = 500) => {
  const query = `
    fields id, name, summary, cover.url, platforms;
    limit ${limit};
    offset ${offset};
  `;

  try {
    const response = await axios.post(IGDB_URL, query, { headers: HEADERS });
    return response.data;
  } catch (error) {
    logger('Error fetching games from IGDB:', error.response?.data || error.message);
    return null;
  }
};

/**
 * Sauvegarde une liste de jeux dans la base de données s'ils n'existent pas encore.
 * @param {Array} games - Liste des jeux à sauvegarder.
 */
export const saveGames = async (games) => {
  for (const game of games) {
    try {
      const existingGame = await Game.findOne({ id: game.id });

      if (!existingGame) {
        const newGame = new Game({
          id: game.id,
          name: game.name,
          summary: game.summary || '',
          coverUrl: game.cover ? game.cover.url : '',
          platforms: game.platforms || [],
          lastUpdated: new Date(),
        });

        logger(`Saving ${newGame.name} (${newGame.id})`);
        await newGame.save();
      }
    } catch (error) {
      logger(`Error adding ${game.name}:`, error);
    }
  }
};

/**
 * Met à jour la base de données en récupérant de nouveaux jeux depuis l'API.
 */
export const updateGames = async () => {
  let offset = 0;
  let hasMoreGames = true;

  while (hasMoreGames) {
    logger(`Fetching games with offset ${offset}...`);

    const games = await fetchGames(offset);

    if (!games || !games.length) {
      logger('No new games found, stopping update.');
      break;
    }

    logger(`${games.length} games received, checking for new entries...`);

    const newGames = [];
    for (const game of games) {
      const exists = await Game.exists({ id: game.id });
      if (!exists) {
        newGames.push(game);
      }
    }

    logger(`${newGames.length} new games to save`);
    await saveGames(newGames);

    offset += 500;

    // Arrêter la boucle si on atteint la dernière page
    if (games.length < 500) {
      hasMoreGames = false;
    }
  }
};

/**
 * Synchronise les jeux en mettant à jour la base de données.
 */
export const syncGames = async () => {
  try {
    await updateGames();
    logger('Update finished successfully');
  } catch (error) {
    logger('Error while syncing games:', error);
  }
};

/**
 * Recherche un jeu par son nom.
 * @param {string} s - Chaîne de recherche.
 * @returns {Array|null} Liste des jeux correspondants ou null.
 */
export const searchGameByString = async (s) => {
  try {
    const games = await Game.find({ name: { $regex: s, $options: 'i' } }).limit(10);

    if (games.length > 0) {
      logger('Matching games:', games);
      return games;
    } else {
      logger('No games found');
      return null;
    }
  } catch (error) {
    logger('Error searching for games:', error);
    return null;
  }
};

/**
 * Recherche un jeu par son ID et retourne son URL de couverture.
 * @param {number} gameId - ID du jeu.
 * @returns {Object|null} Objet contenant l'URL de couverture ou null.
 */
export const searchGameByID = async (gameId) => {
  try {
    const game = await Game.findOne({ id: gameId }, { coverUrl: 1, _id: 0 });

    if (game) {
      logger('Game found:', game);
      return game;
    } else {
      logger('No game found');
      return null;
    }
  } catch (error) {
    logger('Error searching game by ID:', error);
    return null;
  }
};
