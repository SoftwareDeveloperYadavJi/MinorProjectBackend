import  { Router } from "express";
import { addShop , addMenu , getMenus , createCategory , getCategories , getallPendingOrders , updateOrderStatus } from "../controllers/shop.controller.js";


const shopeRouter = Router();

// shop API
shopeRouter.post('/add', addShop as any);
shopeRouter.post('/addmenu/:id', addMenu as any);
shopeRouter.get('/getmenus/:id', getMenus as any);
shopeRouter.post('/createcategory/:id', createCategory as any);
shopeRouter.get('/getcategories/:id', getCategories as any);
shopeRouter.get('/getallpendingorders/:id', getallPendingOrders as any);
shopeRouter.put('/updateorderstatus/:id', updateOrderStatus as any);




export default shopeRouter;



