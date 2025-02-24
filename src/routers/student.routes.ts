import { Router } from "express";
import { studentLogin, studentRegister , studentVerfify , dectectDensity , cerateOrder } from "../controllers/student.controller.js";

import {verifyToken} from "../middleware/middleware.js";

const studentRouter = Router();

studentRouter.post("/register", studentRegister as any);
studentRouter.post("/login", studentLogin as any);
studentRouter.post("/verfify",verifyToken, studentVerfify as any);
studentRouter.post("/dectectDensity",verifyToken, dectectDensity as any);   
studentRouter.post("/placeorder", verifyToken , cerateOrder as any);


export default studentRouter;
