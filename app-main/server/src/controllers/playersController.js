import debug from 'debug';
import User from '../models/users.js';
import mongoose from 'mongoose';

const logger = debug('back:controller:players');

export const addGame = async (req, res) => {
  try {
    logger('adding game to player');
    logger('Params:', req.params);
    logger('Body:', req.body);
    const { gameId } = req.body;
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: 'ID utilisateur ou jeu invalide' });
    }

    const objectId = new mongoose.Types.ObjectId(gameId);

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { games: objectId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    logger(`Game ${gameId} added to user ${userId}`);
    res.json(user);
  }catch (error) {
    logger('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.toString() });
  }
};

export const addPseudo = async (req, res) => {
  try {
    logger('adding pseudo to player');
    logger('Params:', req.params);
    logger('Body:', req.body);
    const { pseudo } = req.body;
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId) || !pseudo ) {
      return res.status(400).json({ message: 'ID utilisateur ou pseudo invalide' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { pseudos: pseudo } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  }catch (error) {
    logger('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.toString() });
  }
};

export const addCountry = async (req, res) => {
  try {
    logger('adding country to player');
    logger('Params:', req.params);
    logger('Body:', req.body);
    const { countryId } = req.body;
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    if (!mongoose.Types.ObjectId.isValid(countryId)) {
      return res.status(400).json({ message: 'ID pays invalide' });
    }

    const objectId = new mongoose.Types.ObjectId(countryId);

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { countries: [objectId] } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    logger('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.toString() });
  }
};

export const getPlayerInfos = async (req, res) => {
  try {
    logger('Params:', req.params);
    const userId = req.params.userId;
    logger(`Getting user ${userId} player infos`);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'User ID invalid' });
    }

    const user = await User.findById(userId).select('countries pseudos games name email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      games: user.games,
      pseudos: user.pseudos,
      countries: user.countries,
    });
  } catch (error) {
    logger('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};

export const deletePseudo = async (req, res) => {
  try {
    logger('Deleting pseudo from player');
    logger('Params:', req.params);
    logger('Body:', req.body);

    const { pseudo } = req.body;
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId) || !pseudo) {
      return res.status(400).json({ message: 'ID utilisateur ou pseudo invalide' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { pseudos: pseudo } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    logger('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.toString() });
  }
};

export const deleteGame = async (req, res) => {
  try {
    logger('Deleting game from player');
    logger('Params:', req.params);
    logger('Body:', req.body);

    const { gameId } = req.body;
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: 'ID utilisateur ou jeu invalide' });
    }

    const objectId = new mongoose.Types.ObjectId(gameId);

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { games: objectId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    logger('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.toString() });
  }
};

export const deleteUser = async (req, res) => {
  logger('Deleting a user');
  logger('Params:', req.params);
  logger('Body:', req.body);

  const { userId } = req.params;
  const { email } = req.body;

  logger('UserId to delete : ', userId);
  logger('Email to delete : ', email);

  if (!userId || !email) {
    return res.status(400).json({ message: 'User ID and email are required' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.email !== email) {
      return res.status(400).json({ message: 'The email does not match the user account' });
    }
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User successfully deleted' });
  } catch (err) {
    logger('Error during user deletion', err);
    res.status(500).json({ message: 'An error occurred while deleting the user. Please try again later.' });
  }
};