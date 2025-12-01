import axios from 'axios';
import dotenv from 'dotenv';
import League from '../models/League.js'; // ⬅️ important !
import debug from 'debug';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const logger = debug('back:api:news');

// Récupération des clés d'API depuis les variables d'environnement
const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = process.env.API_HOST;

logger('[ENV] API_KEY:', API_KEY ? 'Loading' : 'No API Key');
logger('[ENV] API_HOST:', API_HOST ? `Good ${API_HOST}` : 'not good');

/**
 * Fonction pour récupérer les ligues de l'API RapidAPI.
 * Récupère toutes les ligues et filtre celles qui sont "force_selected" ou "selected"
 */
async function fetchLeagues() {
  logger('[fetchLeagues] Api call...');

  try {
    const response = await axios.get(`https://${API_HOST}/leagues`, {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    });

    // Filtrage et transformation des ligues
    const leagues = response.data.data.leagues
      .filter(l => ['force_selected', 'selected'].includes(l.displayPriority?.status))  // Filtre selon la priorité d'affichage
      .map(l => ({
        id: l.id,
        name: l.name,
        slug: l.slug,
        region: l.region,
        image: l.image,
        priority: l.priority,
        displayPriority: l.displayPriority,
        savedAt: new Date()  // Ajout de la date de sauvegarde
      }));

    // Supprimer les ligues de la journée en cours
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);  // Début de la journée
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);  // Fin de la journée

    // Suppression des anciennes ligues de la journée
    await League.deleteMany({ savedAt: { $gte: startOfDay, $lte: endOfDay } });

    // Sauvegarde des nouvelles ligues dans la base de données
    await League.insertMany(leagues);

    logger(`[fetchLeagues] ${leagues.length} leagues saved`);
    return { data: { leagues } };

  } catch (error) {
    logger(`[fetchLeagues] Error: ${error.message}`);
    return { error: error.message, data: { leagues: [] } };
  }
}

/**
 * Fonction pour récupérer les ligues en fonction d'une date, priorité et tri.
 * @param {Object} req - La requête contenant les paramètres de la requête.
 * @param {Object} res - La réponse à renvoyer au client.
 */
const getLeaguesByDate = async (req, res) => {

  logger('[getLeaguesByDate] Query request received:', req.query);

  const { date, priority, sort } = req.query;

  try {
    // Formattage des dates de début et fin de journée
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);  // Début de la journée
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);  // Fin de la journée

    // Création du filtre pour la recherche
    const filter = {
      savedAt: { $gte: dayStart, $lte: dayEnd }
    };

    if (priority !== undefined) {
      const parsedPriority = parseInt(priority);
      if (!isNaN(parsedPriority)) {
        filter.priority = parsedPriority;
      }
    }

    // Création du critère de tri
    const sortOption = {};
    if (sort) {
      const direction = sort.startsWith('-') ? -1 : 1;
      const field = sort.replace(/^-/, '');
      sortOption[field] = direction;
    }

    // Recherche des ligues dans la base de données
    const leagues = await League.find(filter).sort(sortOption).lean();

    logger(`[getLeaguesByDate] ${leagues.length} leagues found for date ${date}`);
    res.json(leagues);

  } catch (error) {
    logger(`[getLeaguesByDate] Error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

// Export des fonctions
export { fetchLeagues, getLeaguesByDate };
