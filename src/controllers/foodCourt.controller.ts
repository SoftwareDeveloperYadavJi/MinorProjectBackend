import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export const addFoodCourt = async (req: Request, res: Response) => {
    try {
        const { name, location, image } = req.body;
        const foodCourtExist = await prisma.foodCourt.findFirst({
            where: {
                name: name,
            },
        });

        if (foodCourtExist) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Food Court already exists' });
        }

        const foodCourt = await prisma.foodCourt.create({
            data: {
                name: name,
                location: location,
                image: image,
            },
        });

        return res.status(StatusCodes.CREATED).json({
            message: 'Food Court created successfully',
            data: foodCourt,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

export const getFoodCourts = async (req: Request, res: Response) => {
    try {
        const foodCourts = await prisma.foodCourt.findMany();

        return res.status(StatusCodes.OK).json({ data: foodCourts });
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

export const removeFoodCourt = async (req: Request, res: Response) => {
    try {
        const foodCourt = await prisma.foodCourt.delete({
            where: {
                id: req.params.id,
            },
        });

        return res.status(StatusCodes.OK).json({
            message: 'Food Court removed successfully',
            data: foodCourt,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

export const getFoodCourtById = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const { id } = req.params.id;
        const foodCourt = await prisma.foodCourt.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                shops: true,
            },
        });
        return res.status(StatusCodes.OK).json({ data: foodCourt });
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

// get total number of pending orders for a food court
export const getTotalPendingOrders = async (req: Request, res: Response) => {
    try {
        const foodCourtId = req.params.id;
        const totalPendingOrders = await prisma.order.count({
            where: {
                foodCourtId: foodCourtId,
                status: 'PENDING',
            },
        });
        return res
            .status(StatusCodes.OK)
            .json({ pendingOrders: totalPendingOrders });
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

// get all shop in food court
export const getAllShops = async (req: Request, res: Response) => {
    try {
        const foodCourtId = req.params.id;
        const shops = await prisma.shop.findMany({
            where: {
                foodCourtId: foodCourtId,
            },
            include: {
                orders: true,
            },
        });
        return res.status(StatusCodes.OK).json({ shops: shops });
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};
