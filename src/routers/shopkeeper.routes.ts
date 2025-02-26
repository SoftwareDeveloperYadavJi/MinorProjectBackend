import express from 'express';
import {
    registerShopkeeper,
    loginShopkeeper,
} from '../controllers/shopkeeper.controller.js';

const shopkeeperRouter = express.Router();

shopkeeperRouter.post('/register', registerShopkeeper as any);
shopkeeperRouter.post('/login', loginShopkeeper as any);

export default shopkeeperRouter;
