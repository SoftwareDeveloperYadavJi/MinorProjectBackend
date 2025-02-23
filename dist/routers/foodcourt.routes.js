import { Router } from "express";
import { addFoodCourt, getFoodCourts, removeFoodCourt, getFoodCourtById, getTotalPendingOrders } from "../controllers/foodCourt.controller.js";
const foodcourtRouter = Router();
foodcourtRouter.post("/add", addFoodCourt);
foodcourtRouter.get("/", getFoodCourts);
foodcourtRouter.delete("/:id", removeFoodCourt);
foodcourtRouter.get("/:id", getFoodCourtById);
foodcourtRouter.get("/pendingorders/:id", getTotalPendingOrders);
export default foodcourtRouter;
