"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.signToken = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const apollo_server_express_1 = require("apollo-server-express");
dotenv_1.default.config();
const secret = process.env.JWT_SECRET_KEY || '';
const expiration = '1h';
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    let token = '';
    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: 'Forbidden' });
    }
};
exports.authenticateToken = authenticateToken;
const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expiration });
};
exports.signToken = signToken;
const authMiddleware = ({ req }) => {
    const authHeader = req.headers.authorization || '';
    let token = '';
    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        return req;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return { user: decoded };
    }
    catch (err) {
        throw new apollo_server_express_1.AuthenticationError('Invalid token');
    }
};
exports.authMiddleware = authMiddleware;
