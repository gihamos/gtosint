import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getCountryById, getGameById, reqCountryList, reqGameList } from '../controllers/dataController.js';

const router = Router();

router.get('/countries', auth, reqCountryList);
router.get('/countries/:countryId', auth, getCountryById);
router.get('/games', auth, reqGameList);
router.get('/games/:gameId', auth, getGameById);

export default router;