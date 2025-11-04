import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import authRoute from './routes/authRoute.js';
import profileRoute from './routes/profileRoute.js';
import bannerRoute from './routes/bannerRoute.js';
import serviceRoute from './routes/serviceRoute.js';
import balanceRoute from './routes/balanceRoute.js';
import topupRoute from './routes/topupRoute.js';
import transactionRoute from './routes/transactionRoute.js';
import transactionHistoryRoute from './routes/transactionHistoryRoute.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/', authRoute);
app.use('/profile', profileRoute);
app.use('/banner', bannerRoute);
app.use('/services', serviceRoute);
app.use('/balance', balanceRoute);
app.use('/topup', topupRoute);
app.use('/transaction', transactionRoute);
app.use('/transaction', transactionHistoryRoute);

app.use(errorHandler);
export default app;
