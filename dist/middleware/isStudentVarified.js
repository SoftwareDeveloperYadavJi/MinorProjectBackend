import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const isStudentVerified = async (req, res, next) => {
    try {
        const { id } = req.params;
        const student = await prisma.student.findUnique({
            where: {
                id,
            },
        });
        if (!student) {
            return res.status(400).json({ message: "Student not found" });
        }
        if (student.isVerified) {
            next();
        }
        else {
            return res.status(400).json({ message: "Student not verified! Please verify your account by summitting OTP send to your email" });
        }
    }
    catch (error) {
        console.log("Error in isStudentVerified", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
