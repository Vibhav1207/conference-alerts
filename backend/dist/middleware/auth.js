"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_academic_alerts_2026_nitin_sir';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid token. User not found.' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};
exports.authenticate = authenticate;
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access forbidden. Admin role required.' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
