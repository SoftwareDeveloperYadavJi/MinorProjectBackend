import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

interface CustomRequest extends Request {
    user?: string;
}

interface DecodedToken extends JwtPayload {
    id: string; 
}

export const verifyToken = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return
        }

        // Ensure JWT_SECRET is available
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const verified = jsonwebtoken.verify(token, secret) as DecodedToken;

        if (!verified.id) {
             res.status(400).json({ message: 'Invalid token structure' });
             return;
        }

        req.user = verified.id;
        next();
    } catch (error) {
        console.error('Error in verifyToken:', error);
        res.status(400).json({ message: 'Invalid token' });
        return;
    }
};
