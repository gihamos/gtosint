import axios from 'axios';
import debug from 'debug';

const logger = debug('back:api:riot');

const getRiotInfosFromId = async (req, res) => {
  logger('Received request :', req.query);

  const RIOT_APIKEY = process.env.RIOT_APIKEY;

  try {
    const { riotId, tagLine } = req.query;
    if (!riotId || !tagLine) {
      return res.status(400).json({ error: 'riotId et tagLine sont requis' });
    }

    // Récupération du compte via Riot ID
    const accountUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${riotId}/${tagLine}`;
    const accountResponse = await axios.get(accountUrl, {
      headers: { 'X-Riot-Token': RIOT_APIKEY }
    });

    const data = accountResponse.data;
    const { puuid } = data;

    // Récupération des infos Summoner via PUUID
    const summonerUrl = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    const summonerResponse = await axios.get(summonerUrl, {
      headers: { 'X-Riot-Token': RIOT_APIKEY }
    });

    const summonerData = summonerResponse.data;
    data.summonerInfo = {
      id: summonerData.id,
      accountId: summonerData.accountId,
      puuid: summonerData.puuid,
      profileIconId: summonerData.profileIconId,
      summonerLevel: summonerData.summonerLevel,
      profileIconUrl: `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/profileicon/${summonerData.profileIconId}.png`
    };

    // Récupération du classement du joueur (Rang Ranked)
    const rankUrl = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}`;
    const rankResponse = await axios.get(rankUrl, {
      headers: { 'X-Riot-Token': RIOT_APIKEY }
    });

    data.rankInfo = rankResponse.data;

    // Récupération des 5 derniers matchs du joueur
    const matchesUrl = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`;
    const matchesResponse = await axios.get(matchesUrl, {
      headers: { 'X-Riot-Token': RIOT_APIKEY }
    });

    const matchIds = matchesResponse.data;
    data.matchHistory = [];

    // Récupération des détails des matchs
    for (const matchId of matchIds) {
      const matchDetailUrl = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`;
      const matchDetailResponse = await axios.get(matchDetailUrl, {
        headers: { 'X-Riot-Token': RIOT_APIKEY }
      });

      const matchData = matchDetailResponse.data;
      const player = matchData.info.participants.find(p => p.puuid === puuid);

      data.matchHistory.push({
        matchId: matchData.metadata.matchId,
        gameMode: matchData.info.gameMode,
        gameDuration: matchData.info.gameDuration,
        championName: player?.championName || 'Unknown',
        championIconUrl: `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${player?.championName}.png`,
        kills: player?.kills || 0,
        deaths: player?.deaths || 0,
        assists: player?.assists || 0,
        win: player?.win || false
      });

    }

    // Envoi des données filtrées au frontend
    const filteredData = {
      puuid: data.puuid,
      gameName: data.gameName,
      tagLine: data.tagLine,
      summonerInfo: data.summonerInfo,
      rankInfo: data.rankInfo,
      matchHistory: data.matchHistory
    };

    if (!filteredData || Object.keys(filteredData).length === 0){
      return res.status(404).json({error: 'données introuvables'});

    }
    logger('res from riot API :', filteredData);
    res.status(200).json(filteredData);

  } catch (error) {
    logger('Error API Riot:', error.message);

    if (error.response) {
      return res.status(500).json({error: 'Clé API riot incorrecte.'});
    }

    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export { getRiotInfosFromId as getRiotInfos };