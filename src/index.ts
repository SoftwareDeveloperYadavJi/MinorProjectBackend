import express from 'express';
import cors from 'cors';
import shopkeeperRouter from './routers/shopkeeper.routes.js';
import foodcourtRouter from './routers/foodcourt.routes.js';
import shopeRouter from './routers/shop.routes.js';
import { config } from './config/config.js';
import studentRouter from './routers/student.routes.js';
import { StatusCodes } from 'http-status-codes';
const app = express();

// This can be edit based on your need
app.use(
    cors({
        origin: 'http://localhost:4000',
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/healthcheck', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'API is working fine!' });
});

// routes
app.use('/api/v1/shopkeeper', shopkeeperRouter);
app.use('/api/v1/foodcourt', foodcourtRouter);
app.use('/api/v1/shop', shopeRouter);
app.use('/api/v1/student', studentRouter);

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});
