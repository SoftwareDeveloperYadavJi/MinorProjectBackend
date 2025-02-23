import { Request , Response } from "express";
import { PrismaClient } from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import  {generateRandomNumber}  from "../utils/generateOtp.js";
import { EmailSender } from "../services/email.service.js";
import z from "zod";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

const emailSchema = z.string().email().refine((email) => email.endsWith("@paruluniversity.ac.in"),{
  message: "Invalid email address",
});
export const studentRegister = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        if (!name || !email || !password || !phoneNumber) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
        }

        const emailValidation = emailSchema.safeParse(email);
        if (!emailValidation.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email address is not associated with Parul University Or Invalid email address" });
        }
        
        const existingStudent = await prisma.student.findUnique({
            where: {
                email,
            },
        });
        if (existingStudent) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Student already exists" });
        }
        const otp = generateRandomNumber(6);
        const hashPassword = await bcrypt.hash(password, 10);
        const student = await prisma.student.create({
            data: {
                name,
                email,
                password: hashPassword,
                phoneNumber,
                otp,
            },
        });
        sendOTP(name, email, otp);
        const token = jsonwebtoken.sign({ id: student.id }, process.env.JWT_SECRET!, {
            expiresIn: "1d",
        });
        return res.status(StatusCodes.CREATED).json({ message: "Student created successfully", token });

    } catch (error) {   
        console.log("Error in studentRegister", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}


const sendOTP = async (name: string, email: string, otp: string) => {
    try {
       const emaisender = new EmailSender();
        await emaisender.sendOTPEmail(email, name, otp);
    } catch (error) {
        console.log("Error in sendOTP", error);
    }
}


export const studentLogin = async (req: Request , res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
        }
        const student = await prisma.student.findUnique({
            where: {
                email,
            },
        });

        if(!student){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken.sign({ id: student.id }, process.env.JWT_SECRET!, {
            expiresIn: "1d",
        });
        return res.status(StatusCodes.OK).json({ message: "Login successful", token });
    } catch (error) {
        console.log("Error in studentLogin", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}

export const studentVerfify = async(req: Request, res: Response) => {
    try {
        // id should come  from middleware
        const {id , otp} = req.body;

        const student = await prisma.student.findUnique({
            where: {
                id,
            },
        });

        if(!student){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Student not found" });
        }

        if(student.otp !== otp){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid OTP" });
        }

        await prisma.student.update({
            where: {
                id,
            },
            data: {
                isVerified: true,
                otp: null,
            },
        });
        return res.status(StatusCodes.OK).json({ message: "Student verified successfully" });
    } catch (error) {
        console.log("Error in studentVerfify", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}


export const dectectDensity = async (req: Request, res: Response) => {
    try {
        res.status(StatusCodes.OK).json({ message: "Successfully detected density" });
    }catch(error){
        console.log("Error in dectectDensity", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}


// Function to generate a unique order number
const generateOrderNumber = async () => {
  let orderNumber;
  let isUnique = false;

  while (!isUnique) {
    orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Check if order number already exists
    const existingOrder = await prisma.order.findUnique({ where: { orderNumber } });
    if (!existingOrder) {
      isUnique = true;
    }
  }
  return orderNumber;
};


export const cerateOrder = async (req: Request, res: Response) => {
     try {
    const { studentId, foodCourtId, shopId, totalAmount, paymentMethod, items } = req.body;
    // Validate input
    if (!studentId || !shopId || !totalAmount || !paymentMethod || !items || items.length === 0 || !foodCourtId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'All fields are required' });
    }
    // Generate unique order number
    const orderNumber = await generateOrderNumber();
    // Create order in the database
    const newOrder = await prisma.order.create({
      data: {
        // @ts-ignore
        orderNumber,
        studentId,
        foodCourtId,
        shopId,
        status: 'PENDING',
        totalAmount,
        paymentStatus: 'PENDING',
        paymentMethod,
        items: {
            // @ts-ignore
          create: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return res.status(StatusCodes.CREATED).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' });
  }
};
