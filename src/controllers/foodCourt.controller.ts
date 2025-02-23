import { Request , Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export const addFoodCourt = async (req: Request, res: Response) => {
    try {
        const { name, location } = req.body;
        const foodCourtExist = await prisma.foodCourt.findFirst({
            where: {
                name: name
            }
        });

        if (foodCourtExist) {
            return res.status(400).json({ message: "Food Court already exist" });
        }

        const foodCourt = await prisma.foodCourt.create({
            data: {
                name: name,
                location: location
            }
        });

        return res.status(201).json({ message: "Food Court added successfully", data: foodCourt });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
        
    }
};

export const getFoodCourts = async (req: Request, res: Response) => {
    try {
        const foodCourts = await prisma.foodCourt.findMany();
        return res.status(200).json({ data: foodCourts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const removeFoodCourt = async (req: Request, res: Response) => {
    try {
        const foodCourt = await prisma.foodCourt.delete({
            where: {
                id: req.params.id
            }
        });

        return res.status(200).json({ message: "Food Court removed successfully", data: foodCourt });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getFoodCourtById = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {id} = req.params.id; 
        const foodCourt = await prisma.foodCourt.findUnique({
          where: {
            id: req.params.id,
          },
          include: {
            shops: true,
           
          },
        });
        return res.status(200).json({ data: foodCourt });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

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
        return res.status(200).json({ pendingOrders: totalPendingOrders });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}