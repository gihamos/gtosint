import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import debug from 'debug';
import { scheduleGameUpdate, scheduleCountryUpdate , scheduleNewsUpdate } from './utils/batchs/programmer.js';
import authRoutes from './routes/authRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import playersRoutes from './routes/playersRoutes.js';
import dataRoutes from './routes/dataRoutes.js';
import newsRoutes from './routes/newsRoutes.js';

dotenv.config();

const logger = debug('back:init');
logger('Debug service launched');

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: envFile });
logger(`ENV charged : ${process.env.NODE_ENV}`);

const app = express();

app.use(cors({
  origin: [
    'https://app.gtosint.com',
    'https://localhost:3000',
    'http://localhost:4200',
    'http://192.168.1.134:30264',
    'http://192.168.1.134',
    'http://192.168.1.179'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { dbName: 'gtosint' })
  .then(() => logger('MongoDB connected'))
  .catch(err => logger(err));

app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/news', newsRoutes);


app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// setting up batchs treatments
scheduleGameUpdate();
scheduleCountryUpdate();
scheduleNewsUpdate();


app.listen(process.env.BACK_PORT, () => {
  logger(`Server running on port ${process.env.BACK_PORT}`);
  logger(`Front running on : ${process.env.FRONT_URL}`);
});