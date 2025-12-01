import cron from 'node-cron';
import debug from 'debug';
import { syncGames } from '../../apis/internet-games.js';
import { syncCountries } from '../../apis/country.js';
import { fetchLeagues } from '../../apis/lol-classement.js';


const logger = debug('back:utils:batch');

export const scheduleGameUpdate = () => {
  cron.schedule('0 3 * * 1', async () => {
    logger('Starting games list update');
    await syncGames();
    logger('Games list update finished with success');
  });

  logger('Games list cron batch job set');
};

export const scheduleCountryUpdate = () => {
  cron.schedule('0 3 5 2 *', async () => {
    logger('Starting annual games list update');
    await syncCountries();
    logger('Games list update finished with success');
  });

  logger('Country list cron batch job set');
};

export const scheduleNewsUpdate = () => {
  cron.schedule('0 3 * * *', async () => {
    logger('Starting daily news update');
    await fetchLeagues();
    logger('New update finished with success');
  });
  logger('Daily news cron batch job set');
};