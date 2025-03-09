import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthenticationError } from 'apollo-server-express';
dotenv.config();
const secret = process.env.JWT_SECRET_KEY || '';
const expiration = '1h';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    let token = '';
    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: 'Forbidden' });
    }
};
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    return jwt.sign(payload, secret, { expiresIn: expiration });
};
export const authMiddleware = ({ req }) => {
    const authHeader = req.headers.authorization || '';
    let token = '';
    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        return req;
    }
    try {
        const decoded = jwt.verify(token, secret);
        return { user: decoded };
    }
    catch (err) {
        throw new AuthenticationError('Invalid token');
    }
};
