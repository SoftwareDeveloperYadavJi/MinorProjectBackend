import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
import jsonwebtoken from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';


export  const registerShopkeeper = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    
    if (!name || !email || !password || !phoneNumber) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'All fields are required' });
    }
    const existingShopkeeper = await prisma.shopKeeper.findUnique({
      where: {
        email,
      },
    });
    if (existingShopkeeper) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Shopkeeper already exists' });
    }

    // hashing the password`
    const hashPassword = await bcrypt.hash(password, 10);

    // creating the shopkeeper
    const shopkeeper = await prisma.shopKeeper.create({
      data: {
        name,
        email,
        password: hashPassword,
        phoneNumber,
      },
    });

    // generating token
    const token = jsonwebtoken.sign( {id: shopkeeper.id}, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: 'Shopkeeper created successfully', token });
  } catch (error) {
    console.log('Error in registerShopkeeper', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};


export const loginShopkeeper = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const shopkeeper = await prisma.shopKeeper.findUnique({
      where: {
        email,
      },
    });
    if (!shopkeeper) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, shopkeeper.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid credentials' });
    }

    // generating token
    const token = jsonwebtoken.sign( {id: shopkeeper.id}, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return res.status(StatusCodes.OK).json({ message: 'Login successful', token });
  } catch (error) {
    console.log('Error in loginShopkeeper', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
}


