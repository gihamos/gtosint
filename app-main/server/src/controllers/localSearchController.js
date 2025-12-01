import debug from 'debug';
import User from '../models/users.js';

const logger = debug('back:controller:localsearch');

export const searchPlayerByMail = async (req, res) => {
  try {
    logger('local search : by mail');
    logger('Query', req.query);
    const { mail } = req.query;

    if ( mail.length < 3 ) {
      return res.status(400).json({ message: 'Mail too short or invalid' });
    }

    const users = await User.find({ email: { $regex: mail, $options: 'i' } });

    if (users.length > 50){
      return res.status(505).json({message: 'Too much users'});
    }

    return res.status(200).json(users);

  } catch (error) {
    logger.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.toString() });
  }
};

export const searchPlayerByPseudo = async (req, res) => {
  try {
    logger('local search : by pseudo');
    logger('Query', req.query);
    const { pseudo } = req.query;

    if ( pseudo.length < 3 ) {
      return res.status(400).json({ message: 'Pseudo too short or invalid' });
    }

    const users = await User.find({ pseudos: { $elemMatch: { $regex: pseudo, $options: 'i' } } });

    if (users.length > 50){
      return res.status(505).json({message: 'Too much users'});
    }

    return res.status(200).json(users);

  } catch (error) {
    logger('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.toString() });
  }
};