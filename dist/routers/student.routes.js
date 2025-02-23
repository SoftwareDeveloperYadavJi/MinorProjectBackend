import { Router } from "express";
import { studentLogin, studentRegister, studentVerfify, dectectDensity, cerateOrder } from "../controllers/student.controller.js";
const studentRouter = Router();
studentRouter.post("/register", studentRegister);
studentRouter.post("/login", studentLogin);
studentRouter.post("/verfify", studentVerfify);
studentRouter.post("/dectectDensity", dectectDensity);
studentRouter.post("/placeorder", cerateOrder);
export default studentRouter;
