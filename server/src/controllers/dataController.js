import debug from 'debug';
import mongoose from 'mongoose';
import Country from '../models/country.js';
import Game from '../models/games.js';

const logger = debug('back:controller:data');

export const reqCountryList = async (req, res) => {
  try {
    let { query } = req.query;
    logger(`Received query in reqCountryList: ${query}`);

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Incorrect query' });
    }

    query = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const countries = await Country.find({
      name: { $regex: query, $options: 'i' }
    }).select('_id name flagUrl region languages').limit(10);

    logger(`Results ${countries.length} countries: ${JSON.stringify(countries)}`);

    const formattedCountries = countries.map((country) => ({
      id: country._id,
      name: country.name,
      flagUrl: country.flagUrl,
      region: country.region,
      languages: country.languages,
    }));

    logger(`Game response for search is: ${JSON.stringify(formattedCountries)}`);

    res.json(formattedCountries);
  } catch (error) {
    logger(`Error in reqCountryList: ${error}`);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};

export const reqGameList = async (req, res) => {
  try {
    let { query } = req.query;
    logger(`Received query in reqGameList: ${query}`);

    if (!query) {
      return res.status(400).json({ message: 'Incorrect query' });
    }

    query = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const games = await Game.find({
      name: { $regex: query, $options: 'i' }
    }).select('_id name summary coverUrl platforms').limit(10);

    const formattedGames = games.map((game) => ({
      id: game._id,
      name: game.name,
      summary: game.summary,
      coverUrl: 'https:' + game.coverUrl || '',
      platforms: game.platforms,
    }));

    logger(`Game response for search is: ${JSON.stringify(formattedGames)}`);

    res.json(formattedGames);
  } catch (error) {
    logger(error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};

export const getCountryById = async (req, res) => {
  try {
    logger('Params:', req.params);
    const countryId = req.params.countryId;
    logger(`Getting country ${countryId} infos`);

    if (!mongoose.Types.ObjectId.isValid(countryId)) {
      return res.status(400).json({ message: 'Country ID invalid' });
    }

    const country = await Country.findById(countryId).select('_id name flagUrl region languages');

    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    res.json({
      id: country._id,
      name: country.name,
      flagUrl: country.flagUrl,
      region: country.region,
      languages: country.languages,
    });
  } catch (error) {
    logger('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};

export const getGameById = async (req, res) => {
  try {
    logger('Params:', req.params);
    const gameId = req.params.gameId;
    logger(`Getting country ${gameId} infos`);

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: 'Game ID invalid' });
    }

    const game = await Game.findById(gameId).select('_id name summary coverUrl platforms');

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const coverUrl = 'https:' + game.coverUrl;

    res.json({
      id: game._id,
      name: game.name,
      summary: game.summary,
      coverUrl: coverUrl,
      platforms: game.platforms,
    });
  } catch (error) {
    logger('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};