import { Router } from "express";
import { studentLogin, studentRegister , studentVerfify , dectectDensity , cerateOrder } from "../controllers/student.controller.js";

const studentRouter = Router();

studentRouter.post("/register", studentRegister as any);
studentRouter.post("/login", studentLogin as any);
studentRouter.post("/verfify", studentVerfify as any);
studentRouter.post("/dectectDensity", dectectDensity as any);   
studentRouter.post("/placeorder", cerateOrder as any);


export default studentRouter;
