import jsonwebtoken from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
        // @ts-ignore
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid token' });
        return;
    }
};
