import dotenv from 'dotenv';
import { Router } from 'express';
import axios from 'axios';
import debug from 'debug';
const route= Router();
dotenv.config();


const STEAM_API_KEY = process.env.STEAM_API_KEY;
const RAW_API_KEY = process.env.RAW_API_KEY;

const logger=debug('back:api:steam');

/**
 * configuration de la route pour retourner les informations d'un joueur(son profil)
 * lorsque l'on connait son steam id
 *
 */
route.get('/user', async ( req, res) => {
  try {
    const steamid  = req.query.steamid;
    if (!steamid) {
      return res.status(400).json({ error: 'The steamid parameter is required' });
    }

    const response = await axios.get('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/', {
      params: {
        key: STEAM_API_KEY,
        steamids: steamid
      }
    });

    const players = response.data?.response?.players || [];
    if (players.length === 0) {
      return res.status(404).json({ error: 'Aucun joueur trouvé pour le steamid fourni' });
    }

    const filteredPlayers = players.map(player => ({
      steamid: player.steamid,
      personaname: player.personaname,
      avatar: player.avatar,
      avatarmedium: player.avatarmedium,
      avatarfull: player.avatarfull,
      lastlogoff: player.lastlogoff,
      communityvisibilitystate: player.communityvisibilitystate===3?1:0 ,
      loccountrycode:player.loccountrycode
    }));
    res.json(filteredPlayers[0]);
  } catch (error) {
    logger('Error during the Steam API call:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});


/**
 * route  pour récupérer les jeux possédés par l'utilisateur
 */
route.get('/user/owned-games', async (req, res) => {
  try {
    const steamId = req.query.steamid;
    if (!steamId) {
      return res.status(400).json({ error: 'The steamid parameter is required.' });
    }

    const response = await axios.get('https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/', {
      params: {
        key: STEAM_API_KEY,
        steamid: steamId,
        include_appinfo: true,
        include_played_free_games: true
      }
    });
    // Vérifier que la réponse contient bien des données pour "games"
    const apiResponse = response.data.response;
    if (!apiResponse || !apiResponse.games) {
      return res.json([]); // retourne un tableau vide s'il n'y a aucun jeu
    }

    // Extraction et filtrage des jeux en se basant sur le modèle SteamGame
    const games= response.data.response.games.filter((game) => { if(game.has_community_visible_stats){
      return true;
    }
    return false; }).map((game) => ({
      steamGameId:{
        appid: game.appid,
        title: game.name,
      } ,

      playtime_forever: game.playtime_forever,
      playtime_2weeks: game.playtime_2weeks,
      img_icon_url: 'https://media.steampowered.com/steamcommunity/public/images/apps/'+game.appid+'/'+game.img_icon_url+'.jpg',
      img_logo_url: 'https://media.steampowered.com/steamcommunity/public/images/apps/'+game.appid+'/'+game.img_logo_url+'.jpg',
      has_community_visible_stats: game.has_community_visible_stats,
    }));

    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Route pour récupérer les derniers jeux joués
 */
route.get('/user/lastplayedgames', async (req, res) => {
  try {
    const steamid = req.query.steamid;
    if (!steamid) {
      return res.status(400).json({ error: 'Le paramètre steamid est requis.' });
    }

    // Préparation des paramètres pour l'appel de l'API Steam
    const params = { key: STEAM_API_KEY, steamid };
    if (req.query.count) {
      params.count = req.query.count;
    }
    else{
      params.count=10;
    }

    // Appel à l'API pour obtenir les jeux récemment joués
    const response = await axios.get(
      'https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/',
      {params: params }
    );

    // Vérifier que la réponse contient bien des données pour "games"
    const apiResponse = response.data.response;
    if (!apiResponse || !apiResponse.games) {
      return res.json([]); // retourne un tableau vide s'il n'y a aucun jeu
    }

    // Extraction et filtrage des jeux en se basant sur le modèle SteamGame
    const games = apiResponse.games.map((game) => ({
      steamGameId:{
        appid: game.appid,
        title: game.name,
      } ,

      playtime_forever: game.playtime_forever,
      playtime_2weeks: game.playtime_2weeks,
      img_logo_url: 'https://media.steampowered.com/steamcommunity/public/images/apps/'+game.appid+'/'+game.img_logo_url+'.jpg',
      has_community_visible_stats: game.has_community_visible_stats,
    }));
    return res.json(games);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


/**
 * Route permettant de retourner les détails du jeu
 */
route.get('/getdetailgame', async (req, res) => {
  const { appid } = req.query;
  if (!appid) {
    return res.status(400).json({ error: 'The appid parameter is required' });
  }

  try {
    // Effectuer une requête vers l'API Steam Store
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}`);
    const data = response.data;

    // Vérifier si les données existent et si la requête a réussi
    if (!data[appid] || !data[appid].success) {
      return res.status(404).json({ error: 'No data concerning this game was found' });
    }

    const gameData = data[appid].data;

    res.json({
      steam_appid: gameData.steam_appid,
      name: gameData.name,
      is_free: gameData.is_free ? 1 : 0,
      release_date: gameData.release_date.date,
      header_image: gameData.header_image,
      capsule_image: gameData.capsule_image,
      achievements: gameData.achievements,
      genres: gameData.genres ? gameData.genres.map(e => e.description) : [],
      date_publication: gameData.date, // Vérifiez que cette propriété correspond bien aux données attendues
      short_description: gameData.short_description,
      detailed_description: gameData.detailed_description,
      website: `https://store.steampowered.com/app/${appid}`,
      developers: gameData.developers,
      publishers: gameData.publishers
    });
  } catch (error) {
    logger('Erreur serveur :', error.message);
    res.status(500).json({ error: 'An error occurred on the server.' });
  }
});


/**
 *  route permettant de retourner la liste de(s) jeux correspondant au nom
 * format ([{routeid,name}])
 */
route.get('/gameslist', async (req, res) => {
  try {
    let gameName  = req.query.gameName;
    if (!gameName) {
      return res.status(400).json({ error: 'The gameName parameter is required' });
    }
    const response = await axios.get('https://api.steampowered.com/ISteamroutes/GetrouteList/v2/');

    res.json({routes:Array.from(response.data.routelist.routes).filter((game) => {
      return String(game.name).toLowerCase().includes(gameName.toLowerCase());
    })} );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * configuration de la route pour retourner les informations le steam id du joeur
 * lorsque l'on connait son pseudo(ce dernier devra etre deinie par le joeur depuis son compte steam)
 *
 */

route.get('/user/getsteamid', async (req, res) => {
  try {

    const  customPseudo  =req.query.customPseudo;
    if (!customPseudo) {
      return res.status(400).json({ error: 'The customPseudo  parameter is required.' });
    }
    const response = await axios.get('https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/', {
      params: {
        key: STEAM_API_KEY,
        vanityurl: customPseudo
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

route.get('/rawg/getgamebytitle', async (req, res) => {
  try {
    const  title  =req.query.title;
    if (!title) {
      return res.status(400).json({ error: 'Le paramètre "title" est requis.' });
    }
    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: RAW_API_KEY,
        search:title
      }
    });
    if (response.count&&parseInt(response.count)===0) {
      return res.status(404).json({ error: 'Aucune donné correspondant à ce titre n\'a été trouvé.' });
    }
    res.json(response.results[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

route.get('/rawg/getdetailgame', async (req, res) => {
  try {
    const slug=req.query.slug;

    if (!slug) {
      return res.status(400).json({ error: 'Le paramètre "slug" est requis.' });
    }
    const response = await axios.get(`https://api.rawg.io/api/games/${slug}`, {
      params: {
        key: RAW_API_KEY
      }
    });

    // Vérification si le jeu n'est pas trouvé
    if (response.detail && response.detail.toLowerCase() === 'not found.') {
      return res.status(404).json({ error: 'Jeu non trouvé.' });
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

route.get('/user/friends', async (req, res) => {
  try {
    const  relationship  =req.query.relationship;
    const steamid=req.query.steamid;
    const response = await axios.get('https://api.steampowered.com/ISteamUser/GetFriendList/v0001/', {
      params: {
        key: STEAM_API_KEY,
        relationship:  relationship,
        steamid:steamid
      }
    });
    res.json(response.data.friendslist.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * Récupérer les stats d'un joueur pour un jeu spécifique
 * Exemple : localhost:3000/steam/player-stats/730/76561198012345678
 */
route.get('/user/player-stats', async (req, res) => {
  try {
    const steamid = req.query.steamid;
    const appid = req.query.appid;
    const param = {
      key: STEAM_API_KEY,
      steamid: steamid,
      appid: appid,
      language: 'french'
    };

    if (req.query.language) {
      param.language = req.query.language;
    }

    const [responseStats, responseSchema] = await Promise.all([
      axios.get('http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/', {
        params: param
      }),
      axios.get('http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/', {
        params: {
          key: STEAM_API_KEY,
          appid: appid,
          language: 'french'
        }
      })
    ]);

    if (!responseStats || !responseSchema) {
      res.status(500).json({ error: 'Statistics information is missing' });
      return;
    }

    // Vérifie si les données existent avant de les manipuler
    let playerstat = responseStats.data.playerstats.stats || [];
    let playersAchevements = responseStats.data.playerstats.achievements || [];

    // Vérification de l'existence de availableGameStats avant de procéder
    if (responseSchema.data.game && responseSchema.data.game.availableGameStats) {
      // Manipuler les statistiques
      playerstat = playerstat.map((stat) => {
        const data = responseSchema.data.game.availableGameStats.stats.find(element => element.name.toLowerCase() === stat.name.toLowerCase());
        if (data) {
          stat.displayName = data.displayName;
        }
        return stat;
      });

      // Manipuler les achievements
      if (responseSchema.data.game.availableGameStats.achievements) {
        playersAchevements = playersAchevements.map((achievement) => {
          const data = responseSchema.data.game.availableGameStats.achievements.find(element => element.name.toLowerCase() === achievement.name.toLowerCase());
          if (data) {
            achievement.displayName = data.displayName;
            achievement.icon = data.icon;
            achievement.description = data.description || '';
          }
          achievement.achieved = parseInt(achievement.achieved);
          return achievement;
        });
      }
    } else {
      // Gestion de l'absence de `availableGameStats`
      logger('availableGameStats non trouvé dans la réponse de l\'API Schema');
    }

    const data = {
      steamProfileGamesAchevements: {
        steamid: steamid,
        gameName: responseStats.data.playerstats.gameName,
        achievements: playersAchevements
      },
      stats: playerstat
    };

    res.json(data);
  } catch (error) {
    logger(error);
    res.status(500).json({ error: 'Error when recovering player statistics' });
  }
});


/**
 * configuration de la route pour retourner les news d'un game
 *
 */

route.get('/getnewsgame', async (req, res) => {
  try {
    const   appid  =req.query.appid;
    const   count  =req.query.count;
    const   maxlength  =req.query.maxlength;
    const response = await axios.get('https://api.steampowered.com/ISteamNews/GetNewsForroute/v0002', {
      params: {
        key: STEAM_API_KEY,
        count: count,
        appid:appid,
        maxlength:maxlength
      }
    });
    res.json(response.data.newsitems.map((item) => {

      item.contents =item.contents.replace('{STEAM_CLAN_IMAGE}','https://steamcdn-a.akamaihd.net/steamcommunity/public/images/clans');
      return item;
    }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * Route pour récupérer les statistiques globales d'un jeu Steam
 * Exemple d'routeel : localhost:3000/steam/game_stats/730?stats=total_kills,total_deaths
 */
route.get('/game_stats/:routeid', async (req, res) => {
  try {
    const { routeid } = req.params;  // Récupère l'ID du jeu depuis l'URL
    const stats = req.query.stats ? req.query.stats.split(',') : ['total_kills', 'total_deaths'];  // Statistiques demandées
    const count = stats.length;

    const url = `http://api.steampowered.com/ISteamUserStats/GetGlobalStatsForGame/v0001/?routeid=${routeid}&count=${count}&${stats.map((s, i) => `name[${i}]=${s}`).join('&')}&key=${STEAM_API_KEY}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    logger(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques du jeu' });
  }
});

;


export default route;