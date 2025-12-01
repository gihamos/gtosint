// routes/leagueRoutes.js
import express from 'express';
import { getLeaguesByDate } from '../apis/lol-classement.js';

const router = express.Router();

router.get('/', getLeaguesByDate);

export default router;