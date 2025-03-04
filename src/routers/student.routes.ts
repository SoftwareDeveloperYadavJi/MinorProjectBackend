import { Router } from 'express';

import {
    studentLogin,
    studentRegister,
    studentVerfify,
    dectectDensity,
    cerateOrder,
    resendOTP,
    getStudentpastOrders,
    studentPorfile,
    updateStudentProfile,
} from '../controllers/student.controller.js';

import { verifyToken } from '../middleware/middleware.js';
import { isStudentVerified } from '../middleware/isStudentVarified.js';

const studentRouter = Router();

studentRouter.post('/register', studentRegister as any);
studentRouter.post('/login', studentLogin as any);
studentRouter.post('/verfify', verifyToken, studentVerfify as any);
studentRouter.post('/dectectDensity', verifyToken, dectectDensity as any);
studentRouter.post(
    '/placeorder',
    verifyToken,
    isStudentVerified,
    cerateOrder as any,
);
studentRouter.post('/resendOtp', verifyToken, resendOTP as any);
studentRouter.get('/getmyorders', verifyToken, getStudentpastOrders as any);
studentRouter.get('/getprofile', verifyToken, studentPorfile as any);
studentRouter.post('/profileupdate', verifyToken, updateStudentProfile as any);

export default studentRouter;
