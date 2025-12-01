import axios from 'axios';
import { cleanData } from '../utils/apisDataTreatment/overfastCleanData.js';
import debug from 'debug';

const logger = debug('back:api:overfast');

// Endpoint pour récupérer les infos d'un joueur via OverFast API
export const getPlayerInfos = async (req, res) => {
  logger('Received request :', req.query);

  try {
    const { battleName, battleTag } = req.query;

    // Vérifier si les paramètres battleName et battleTag sont fournis
    if (!battleName || !battleTag) {
      return res.status(400).json({ error: 'BattleTag et battleName requis' });
    }

    // URL de l'API OverFast avec les paramètres fournis
    const url = `https://overfast-api.tekrop.fr/players/${battleName}-${battleTag}`;

    // Faire la requête à l'API OverFast pour récupérer les données du joueur
    const response = await axios.get(url);
    let data = await response.data;

    // Appliquer le nettoyage des données pour les rendre conformes à l'interface souhaitée
    data = cleanData(data);

    // Retourner les données nettoyées au client
    res.json(data);

  } catch (error) {
    logger('Error API OverFast:', error.message);

    // Si l'erreur provient de la réponse de l'API (par exemple, erreur 404)
    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    }

    // Si l'erreur est une erreur serveur (500 ou autres erreurs inattendues)
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
};
