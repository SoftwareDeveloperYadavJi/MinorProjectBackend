import { Router } from "express";
import { addFoodCourt, getFoodCourts, removeFoodCourt , getFoodCourtById , getTotalPendingOrders } from "../controllers/foodCourt.controller.js";
const foodcourtRouter = Router();

foodcourtRouter.post("/add", addFoodCourt as any);
foodcourtRouter.get("/", getFoodCourts as any);
foodcourtRouter.delete("/:id", removeFoodCourt as any);
foodcourtRouter.get("/:id", getFoodCourtById as any);
foodcourtRouter.get("/pendingorders/:id", getTotalPendingOrders as any);


export default foodcourtRouter;