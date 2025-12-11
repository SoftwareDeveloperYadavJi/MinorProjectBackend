import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CustomRequest extends Request {
    user?: string;
}

export const isShopkeeper = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const id = req.user;

        if (!id) {
            res.status(401).json({
                message: 'Unauthorized: No user ID provided',
            });
            return;
        }

        const shopkeeper = await prisma.shopKeeper.findUnique({
            where: { id },
        });

        if (!shopkeeper) {
            res.status(404).json({ message: 'ShopKeeper not found' });
            return;
        }

        if (!shopkeeper.isVerified) {
            res.status(400).json({
                message:
                    'ShopKeeper not verified! Please verify your account by submitting the OTP sent to your email.',
            });
            return;
        }

        next();
    } catch (error) {
        console.error('Error in isShopkeeper:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
