import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateRandomNumber } from '../utils/generateOtp.js';
import { EmailSender } from '../services/email.service.js';
import z from 'zod';
import { StatusCodes } from 'http-status-codes';
import { uploadToCloudinary } from '../utils/uplodeImage.js';

const prisma = new PrismaClient();

const emailSchema = z
    .string()
    .email()
    .refine((email) => email.endsWith('@paruluniversity.ac.in'), {
        message: 'Invalid email address',
    });

interface CustomRequest extends Request {
    user?: string;
}

export const studentRegister = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        if (!name || !email || !password || !phoneNumber) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'All fields are required' });
        }
        let profileImageUrl = '';
        if (req.files && req.files.profile) {
            const uploadResult = await uploadToCloudinary(
                req.files.profile,
                'profiles',
            );
            profileImageUrl = uploadResult.secure_url;
        }

        // console.log(profileImageUrl);
        // const emailValidation = emailSchema.safeParse(email);
        // if (!emailValidation.success) {
        //     return res.status(StatusCodes.BAD_REQUEST).json({
        //         message:
        //             'Email address is not associated with Parul University Or Invalid email address',
        //     });
        // }

        const existingStudent = await prisma.student.findUnique({
            where: {
                email,
            },
        });
        if (existingStudent) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Student already exists' });
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
                image: profileImageUrl,
            },
        });
        sendOTP(name, email, otp);
        const token = jsonwebtoken.sign(
            { id: student.id },
            process.env.JWT_SECRET!,
            {
                expiresIn: '1d',
            },
        );
        return res
            .status(StatusCodes.CREATED)
            .json({ message: 'Student created successfully', token });
    } catch (error) {
        console.log('Error in studentRegister', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

const sendOTP = async (name: string, email: string, otp: string) => {
    try {
        const emaisender = new EmailSender();
        await emaisender.sendOTPEmail(email, name, otp);
    } catch (error) {
        console.log('Error in sendOTP', error);
    }
};

export const studentLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'All fields are required' });
        }
        const student = await prisma.student.findUnique({
            where: {
                email,
            },
        });

        if (!student) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            student.password,
        );
        if (!isPasswordValid) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken.sign(
            { id: student.id },
            process.env.JWT_SECRET!,
            {
                expiresIn: '1d',
            },
        );
        return res
            .status(StatusCodes.OK)
            .json({ message: 'Login successful', token });
    } catch (error) {
        console.log('Error in studentLogin', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

export const studentPorfile = async (req: CustomRequest, res: Response) => {
    try {
        // id should come  from middleware
        const id = req.user;
        const student = await prisma.student.findUnique({
            where: {
                id,
            },
            select: {
                name: true,
                email: true,
                phoneNumber: true,
                image: true,
            },
        });
        if (!student) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Student not found' });
        }
        return res
            .status(StatusCodes.OK)
            .json({ message: 'Student profile', student });
    } catch (error) {
        console.log('Error in studentPorfile', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

export const studentVerfify = async (req: CustomRequest, res: Response) => {
    try {
        // id should come  from middleware

        const id = req.user;
        const { otp } = req.body;
        console.log(id);
        const student = await prisma.student.findUnique({
            where: {
                id,
            },
        });

        if (!student) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Student not found' });
        }

        if (student.otp !== otp) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Invalid OTP' });
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
        return res
            .status(StatusCodes.OK)
            .json({ message: 'Student verified successfully' });
    } catch (error) {
        console.log('Error in studentVerfify', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

export const dectectDensity = async (req: Request, res: Response) => {
    try {
        res.status(StatusCodes.OK).json({
            message: 'Successfully detected density',
        });
    } catch (error) {
        console.log('Error in dectectDensity', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

// Function to generate a unique order number
const generateOrderNumber = async () => {
    let orderNumber;
    let isUnique = false;

    while (!isUnique) {
        orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        // Check if order number already exists
        const existingOrder = await prisma.order.findUnique({
            where: { orderNumber },
        });
        if (!existingOrder) {
            isUnique = true;
        }
    }
    return orderNumber;
};

interface coustomRequest extends Request {
    user?: string;
}

export const cerateOrder = async (req: coustomRequest, res: Response) => {
    try {
        const studentId = req.user;
        const student = await prisma.student.findUnique({
            where: {
                id: studentId,
            },
        });
        console.log(student);
        if (!student) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: 'Student not found' });
        }

        const { foodCourtId, shopId, totalAmount, paymentMethod, items } =
            req.body;
        // Validate input
        if (
            !studentId ||
            !shopId ||
            !totalAmount ||
            !paymentMethod ||
            !items ||
            items.length === 0 ||
            !foodCourtId
        ) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: 'All fields are required' });
        }
        // Generate unique order number
        const orderNumber = await generateOrderNumber();
        // Create order in the database
        if (orderNumber == null) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'Error while generating order number' });
        }
        interface OrderItem {
            menuItemId: string;
            quantity: number;
            price: number;
        }

        const newOrder = await prisma.order.create({
            data: {
                orderNumber,
                studentId: studentId as string,
                foodCourtId: req.body.foodCourtId,
                shopId: req.body.shopId,
                status: 'PENDING',
                totalAmount: req.body.totalAmount,
                paymentStatus: 'PENDING',
                paymentMethod: req.body.paymentMethod,
                items: {
                    create: req.body.items.map((item: OrderItem) => ({
                        menuItemId: item.menuItemId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: { items: true },
        });

        res.status(StatusCodes.CREATED).json({
            message: 'Order created successfully',
            order: newOrder,
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Something went wrong',
        });
        return;
    }
};

export const resendOTP = async (req: coustomRequest, res: Response) => {
    try {
        const id = req.user;
        const student = await prisma.student.findUnique({
            where: {
                id,
            },
        });

        if (!student) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Student not found',
            });
            return;
        }

        if (student.isVerified) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Student already verified',
            });
            return;
        }

        const otp = generateRandomNumber(6);

        const updateStudent = await prisma.student.update({
            where: {
                id: student.id,
            },
            data: {
                otp: otp,
            },
        });
        sendOTP(updateStudent.name, updateStudent.email, otp);
        res.status(StatusCodes.OK).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.log('Error while Resending OTP', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Error while Resending OTP',
        });
        return;
    }
};

export const getStudentpastOrders = async (
    req: coustomRequest,
    res: Response,
) => {
    try {
        const studentId = req.user;
        const student = await prisma.student.findUnique({
            where: {
                id: studentId,
            },
        });
        if (!student) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: 'Student not found' });
        }
        const orders = await prisma.order.findMany({
            where: {
                studentId: studentId,
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

export const updateStudentProfile = async (
    req: coustomRequest,
    res: Response,
) => {
    try {
        const studentId = req.user;
        const { name, phoneNumber } = req.body;
        if (!name || !phoneNumber) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'All fields are required' });
        }
        let profileImageUrl = '';
        if (req.files && req.files.profile) {
            const uploadResult = await uploadToCloudinary(
                req.files.profile,
                'profiles',
            );
            profileImageUrl = uploadResult.secure_url;
        }

        // const hashPassword = await bcrypt.hash(password, 10);

        const updatedStudent = await prisma.student.update({
            where: {
                id: studentId,
            },
            data: {
                name,
                // password: hashPassword,
                phoneNumber,
                image: profileImageUrl,
            },
            select: {
                name: true,
                email: true,
                phoneNumber: true,
                image: true,
            },
        });

        res.status(StatusCodes.OK).json({
            message: 'Student profile updated successfully',
            data: updatedStudent,
        });
        return;
    } catch (error) {
        console.log(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal Server Error' });
    }
};
