import './env';
import { connect, seedDatabase } from './db';
import { startJob } from './jobs/scrapper';
import { TwitterApi } from './api/twitter';
import { validateEnv } from './utils';


const ONE_MINUTE = 1000 * 60;
const run = async () => {
  validateEnv();
  await connect(process.env.DB_URI);
  await seedDatabase();
  const twitterApi = new TwitterApi(process.env.TWITTER_API_KEY, process.env.TWITTER_API_SECRET);
  await twitterApi.init();
  await startJob(twitterApi, ONE_MINUTE * 60);
  console.log('[*] Twitter Scrapper Started [*]')
};

run();
