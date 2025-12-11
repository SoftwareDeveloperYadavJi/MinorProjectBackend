import { Router } from 'express';
import {
    addShop,
    addMenu,
    getMenus,
    createCategory,
    getCategories,
    getallPendingOrders,
    updateOrderStatus,
    getTotalPendingOrders,
} from '../controllers/shop.controller.js';
import { verifyToken } from '../middleware/middleware.js';
import { isShopkeeper } from '../middleware/isShopkeeper.js';

const shopeRouter = Router();

// shop API
shopeRouter.post('/add', isShopkeeper, addShop as any);
shopeRouter.post('/addmenu/:id', isShopkeeper, addMenu as any);
shopeRouter.get('/getmenus/:id', isShopkeeper, getMenus as any);
shopeRouter.post('/createcategory/:id', isShopkeeper, createCategory as any);
shopeRouter.get('/getcategories/:id', isShopkeeper, getCategories as any);
shopeRouter.get('/getallpendingorders/:id', isShopkeeper , getallPendingOrders as any);
shopeRouter.put('/updateorderstatus/:id', isShopkeeper , updateOrderStatus as any);
shopeRouter.get('/pendingorders/:id',  isShopkeeper , getTotalPendingOrders as any);

export default shopeRouter;
