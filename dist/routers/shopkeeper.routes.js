import express from 'express';
import { registerShopkeeper, loginShopkeeper } from '../controllers/shopkeeper.controller.js';
const shopkeeperRouter = express.Router();
shopkeeperRouter.post('/register', registerShopkeeper);
shopkeeperRouter.post('/login', loginShopkeeper);
export default shopkeeperRouter;
