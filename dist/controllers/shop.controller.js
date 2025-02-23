import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const addShop = async (req, res) => {
    try {
        const { name, description, foodCourtId, shopKeeperId, gstNumber, license, contactEmail, contactPhone, operatingHours, } = req.body;
        // Check if the shop already exists
        const shopExist = await prisma.shop.findFirst({
            where: { name },
        });
        if (shopExist) {
            return res.status(400).json({ message: 'Shop already exists' });
        }
        // Convert time strings to ISO 8601 format
        const formattedOperatingHours = operatingHours.map((hours) => ({
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
            .status(201)
            .json({ message: 'Shop added successfully', data: shop });
    }
    catch (error) {
        console.error('Error while adding shop:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const addMenu = async (req, res) => {
    try {
        const shopId = req.params.id;
        const { name, description, price, preprationTime, isAvailable, image, categoryId } = req.body;
        const checkMenueExist = await prisma.menuItem.findFirst({
            where: { name },
        });
        if (checkMenueExist) {
            return res
                .status(400)
                .json({ message: 'Menu already exists with this name' });
        }
        const menu = await prisma.menuItem.create({
            //@ts-ignore
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
            .status(201)
            .json({ message: 'Menu added successfully', data: menu });
    }
    catch (error) {
        console.error('Error while adding menu:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const createCategory = async (req, res) => {
    try {
        const shopId = req.params.id;
        const { name, description, } = req.body;
        const checkCategoryExist = await prisma.category.findFirst({
            where: { name },
        });
        if (checkCategoryExist) {
            return res
                .status(400)
                .json({ message: 'Category already exists with this name' });
        }
        const category = await prisma.category.create({
            //@ts-ignore
            data: {
                name,
                description,
                shopId,
            },
        });
        return res
            .status(201)
            .json({ message: 'Category added successfully', data: category });
    }
    catch (error) {
        console.error('Error while adding category:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const getCategories = async (req, res) => {
    try {
        const shopId = req.params.id;
        const categories = await prisma.category.findMany({
            where: {
                shopId,
            },
        });
        return res.status(200).json({ data: categories });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const getMenus = async (req, res) => {
    try {
        const shopId = req.params.id;
        const menus = await prisma.menuItem.findMany({
            where: {
                shopId,
            },
        });
        return res.status(200).json({ data: menus });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const getallPendingOrders = async (req, res) => {
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
        return res.status(200).json({ data: orders });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
// updare the odere status
export const updateOrderStatus = async (req, res) => {
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
        });
        return res.status(200).json({ message: 'Order status updated successfully', data: updatedOrder });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
