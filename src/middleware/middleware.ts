import jsonwebtoken from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log(token);
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        const verified = jsonwebtoken.verify(token, process.env.JWT_SECRET!);
        // @ts-ignore
        console.log('verified', verified);
        // @ts-ignore
        req.user = verified.id;
        next();
    } catch (error) {
        console.log('Error in verifyToken', error);
        res.status(400).json({ message: 'Invalid token' });
        return;
    }
};
