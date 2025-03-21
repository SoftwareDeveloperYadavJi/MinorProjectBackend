import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
// import messaging from '../utils/firebaseConfig';
// const registrationToken = 'dZjLC_2EQA25lASLviqxLu:APA91bGyYb6o8chThaI4uSd_WmxPY2_2qu_vTLOw9cdhKybVP1-Buaad6ywMVP_QJMqCM74RnMMm056-W7Fvv2c_aqgoZYxHTghJTJTz4MNjNnFd3zQZeoY';
const prisma = new PrismaClient();

export const addShop = async (req: Request, res: Response) => {
    try {
        const {
            name,
            description,
            foodCourtId,
            shopKeeperId,
            gstNumber,
            images,
            license,
            contactEmail,
            contactPhone,
            operatingHours,
        } = req.body;

        // Check if the shop already exists
        const shopExist = await prisma.shop.findFirst({
            where: { name },
        });

        if (shopExist) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Shop already exists' });
        }

        // Convert time strings to ISO 8601 format
        const formattedOperatingHours = operatingHours.map((hours: any) => ({
            dayOfWeek: hours.dayOfWeek,
            openTime: `1970-01-01T${hours.openTime}Z`, // Fixed date with provided time
            closeTime: `1970-01-01T${hours.closeTime}Z`, // Fixed date with provided time
            isOpen: hours.isOpen,
        }));

        // Create the shop along with its operating hours
        const shop = await prisma.shop.create({
            data: {
                name,
                description,
                images,
                foodCourtId,
                shopKeeperId,
                gstNumber,
                license,
                contactEmail,
                contactPhone,
                operatingHours: {
                    create: formattedOperatingHours,
                },
            },
            include: { operatingHours: true }, // Include operating hours in the response
        });

        return res
            .status(StatusCodes.CREATED)
            .json({ message: 'Shop added successfully', data: shop });
    } catch (error) {
        console.error('Error while adding shop:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

export const addMenu = async (req: Request, res: Response) => {
    try {
        const shopId = req.params.id;
        const {
            name,
            description,
            price,
            preprationTime,
            isAvailable,
            image,
            categoryId,
        } = req.body;

        const checkMenueExist = await prisma.menuItem.findFirst({
            where: { name },
        });

        if (checkMenueExist) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Menu already exists with this name' });
        }

        const menu = await prisma.menuItem.create({
            data: {
                name,
                description,
                price,
                preparationTime: Number(preprationTime),
                isAvailable,
                shopId: shopId,
                categoryId,
                image,
            },
        });

        return res
            .status(StatusCodes.CREATED)
            .json({ message: 'Menu added successfully', data: menu });
    } catch (error) {
        console.error('Error while adding menu:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const shopId = req.params.id;
        const { name, description } = req.body;

        const checkCategoryExist = await prisma.category.findFirst({
            where: { name },
        });

        if (checkCategoryExist) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Category already exists with this name' });
        }

        const category = await prisma.category.create({
            data: {
                name,
                description,
                shopId,
            },
        });

        return res
            .status(StatusCodes.CREATED)
            .json({ message: 'Category added successfully', data: category });
    } catch (error) {
        console.error('Error while adding category:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const shopId = req.params.id;
        const categories = await prisma.category.findMany({
            where: {
                shopId,
            },
        });
        return res.status(StatusCodes.OK).json({ data: categories });
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

export const getMenus = async (req: Request, res: Response) => {
    try {
        const shopId = req.params.id;
        const menus = await prisma.menuItem.findMany({
            where: {
                shopId,
            },
        });
        return res.status(StatusCodes.OK).json({ data: menus });
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

export const getallPendingOrders = async (req: Request, res: Response) => {
    try {
        const shopId = req.params.id;
        const orders = await prisma.order.findMany({
            where: {
                shopId,
                status: 'PENDING',
            },
            include: {
                items: true,
            },
        });
        return res.status(StatusCodes.OK).json({ data: orders });
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

// updare the odere status
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const status = req.body.status;
        const updatedOrder = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                status,
            },
            include: {
                student: true,
            },
        });

        // get the name of the student
        const studentName = updatedOrder.student.name;

        // const message = {
        //     data: {
        //         body: `Hi ${studentName}, Your order id is ${orderId} and status is ${status}`,
        //     },
        //     token: registrationToken,
        // };

        // messaging.send(message)
        //     .then((response) => {
        //         // Response is a message ID string.
        //         console.log('Successfully sent message:', response);
        //     })
        //     .catch((error) => {
        //         console.log('Error sending message:', error);
        // });
        return res.status(StatusCodes.OK).json({
            studentName: updatedOrder.student.name,
            message: 'Order status updated successfully',
            data: updatedOrder,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};

// get all menu items

export const getTotalPendingOrders = async (req: Request, res: Response) => {
    try {
        const shopId = req.params.id;
        const totalPendingOrders = await prisma.order.count({
            where: {
                shopId: shopId,
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
