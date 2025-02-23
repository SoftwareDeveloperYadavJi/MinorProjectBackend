import { Router } from "express";
import { addShop, addMenu, getMenus, createCategory, getCategories, getallPendingOrders, updateOrderStatus } from "../controllers/shop.controller.js";
const shopeRouter = Router();
// shop API
shopeRouter.post('/add', addShop);
shopeRouter.post('/addmenu/:id', addMenu);
shopeRouter.get('/getmenus/:id', getMenus);
shopeRouter.post('/createcategory/:id', createCategory);
shopeRouter.get('/getcategories/:id', getCategories);
shopeRouter.get('/getallpendingorders/:id', getallPendingOrders);
shopeRouter.put('/updateorderstatus/:id', updateOrderStatus);
export default shopeRouter;
