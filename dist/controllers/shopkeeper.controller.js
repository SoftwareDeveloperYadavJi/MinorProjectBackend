import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
import jsonwebtoken from 'jsonwebtoken';
export const registerShopkeeper = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        if (!name || !email || !password || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingShopkeeper = await prisma.shopKeeper.findUnique({
            where: {
                email,
            },
        });
        if (existingShopkeeper) {
            return res.status(400).json({ message: 'Shopkeeper already exists' });
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
        const token = jsonwebtoken.sign({ id: shopkeeper.id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        return res
            .status(201)
            .json({ message: 'Shopkeeper created successfully', token });
    }
    catch (error) {
        console.log('Error in registerShopkeeper', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const loginShopkeeper = async (req, res) => {
    try {
        const { email, password } = req.body;
        const shopkeeper = await prisma.shopKeeper.findUnique({
            where: {
                email,
            },
        });
        if (!shopkeeper) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, shopkeeper.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // generating token
        const token = jsonwebtoken.sign({ id: shopkeeper.id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        return res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.log('Error in loginShopkeeper', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
