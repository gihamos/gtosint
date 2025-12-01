import { Router } from 'express';
import auth from '../middleware/auth.js';
import { addGame, addPseudo, addCountry, getPlayerInfos, deletePseudo, deleteGame, deleteUser } from '../controllers/playersController.js';

const router = Router();

router.get('/:userId/', auth, getPlayerInfos);

router.post('/:userId/pseudos', auth, addPseudo);
router.post('/:userId/games', auth, addGame);
router.post('/:userId/countries', auth, addCountry);

router.delete('/:userId/pseudos', auth, deletePseudo);
router.delete('/:userId/games', auth, deleteGame);
router.delete('/:userId', deleteUser);


export default router;