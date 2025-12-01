import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getRiotInfos } from '../apis/riot.js';
import { getPlayerInfos } from '../apis/overfast.js';
import { getCrInfos } from '../apis/CR.js';
import { searchPlayerByMail, searchPlayerByPseudo } from '../controllers/localSearchController.js';
import steamInfo from '../apis/steam-api.js';

const router = Router();

router.get('/local/mail', auth, searchPlayerByMail);
router.get('/local/pseudo', auth, searchPlayerByPseudo);

router.get('/advanced/riot', getRiotInfos);
router.get('/advanced/overfast', getPlayerInfos);
router.get('/advanced/cr', getCrInfos);
router.use('/advanced/steam',steamInfo);

export default router;