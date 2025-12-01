import { Router } from 'express';
import { getLeaguesByDate } from '../apis/lol-classement.js';

const router = Router();

router.get('/leagueofLegend/infosLeague', getLeaguesByDate);

export default router;