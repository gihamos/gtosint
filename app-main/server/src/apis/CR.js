import axios from 'axios';
import debug from 'debug';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const logger = debug('back:api:clash');

// Récupérer la clé API Clash Royale depuis les variables d'environnement
const CR_KEY = process.env.CR_KEY;

/**
 * Récupère les informations d'un joueur Clash Royale et ses coffres à venir.
 * @param {Object} req - Requête HTTP contenant le clashId dans les paramètres.
 * @param {Object} res - Réponse HTTP envoyée au client.
 */
export const getCrInfos = async (req, res) => {
  try {
    const clashTag = req.query.clashId;
    
    if (!clashTag) {
      return res.status(400).json({ error: 'clashId is required' });
    }

    // URL de l'API pour récupérer les infos du joueur
    const playerUrl = `https://api.clashroyale.com/v1/players/%23${clashTag}`;
    logger(`Fetching player data: ${playerUrl}`);

    // Requête à l'API Clash Royale
    const playerResponse = await axios.get(playerUrl, {
      headers: { 'Authorization': `Bearer ${CR_KEY}` }
    });

    let crData = playerResponse.data;

    // Transformation des données du joueur pour correspondre à un format plus simple
    crData = {
      name: crData.name || 'Unknown',
      trophies: crData.trophies || 0,
      bestTrophies: crData.bestTrophies || 0,
      arenaName: crData.arena?.name || 'Unknown',
      wins: crData.wins || 0,
      losses: crData.losses || 0,
      battleCount: crData.battleCount || 0,
      threeCrownWins: crData.threeCrownWins || 0,
      clan: {
        name: crData.clan?.name || 'None',
        donations: crData.donations || 0,
        totalDonations: crData.totalDonations || 0
      }
    };

    // URL de l'API pour récupérer les coffres à venir
    const chestsUrl = `https://api.clashroyale.com/v1/players/%23${clashTag}/upcomingchests`;
    logger(`Fetching upcoming chests: ${chestsUrl}`);

    const chestsResponse = await axios.get(chestsUrl, {
      headers: { 'Authorization': `Bearer ${CR_KEY}` }
    });

    // Données filtrées à renvoyer au client
    const filteredData = {
      player: crData,
      chests: chestsResponse.data.items || [],
    };

    logger('Data fetched successfully:', filteredData);
    
    // Envoi des données au client
    res.json(filteredData);

  } catch (error) {
    logger('API Clash Royale error:', error.message);

    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default getCrInfos;
