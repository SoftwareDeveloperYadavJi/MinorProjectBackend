
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const isStudentVerified = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const id  = req.user;
        const student = await prisma.student.findUnique({
            where: {
                id,
            },
        });
        if (!student) {
            res.status(400).json({ message: "Student not found" });
            return;
        }
        if (student.isVerified) {
            next();
        } else {
            res.status(400).json({ message: "Student not verified! Please verify your account by summitting OTP send to your email" });
            return;
        }
    } catch (error) {
        console.log("Error in isStudentVerified", error);
         res.status(500).json({ message: "Internal server error" });
         return;
    }
};