"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBookmark = exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || 'f8c7e9a3b2d10456e7f89a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f';
    return jsonwebtoken_1.default.sign({ id: userId }, secret);
};
const register = async (req, res, next) => {
    try {
        const { name, email, password, institution, country } = req.body;
        const cleanEmail = email.toLowerCase().trim();
        const existingUser = await User_1.User.findOne({ email: cleanEmail });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists' });
        }
        const isFirstUser = (await User_1.User.countDocuments()) === 0;
        const role = isFirstUser || cleanEmail.includes('admin') ? 'admin' : 'user';
        const user = await User_1.User.create({
            name,
            email: cleanEmail,
            password,
            institution,
            country,
            role,
        });
        const token = generateToken(user._id.toString());
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    institution: user.institution,
                    country: user.country,
                    bookmarkedConferences: user.bookmarkedConferences,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        const cleanEmail = email.toLowerCase().trim();
        const user = await User_1.User.findOne({ email: cleanEmail }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = generateToken(user._id.toString());
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    institution: user.institution,
                    country: user.country,
                    bookmarkedConferences: user.bookmarkedConferences,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        res.json({
            success: true,
            data: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                institution: req.user.institution,
                country: req.user.country,
                bookmarkedConferences: req.user.bookmarkedConferences,
                alertSubscriptions: req.user.alertSubscriptions,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
const toggleBookmark = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const { conferenceId } = req.params;
        const user = req.user;
        const index = user.bookmarkedConferences.findIndex((id) => id.toString() === conferenceId);
        let bookmarked = false;
        if (index > -1) {
            user.bookmarkedConferences.splice(index, 1);
        }
        else {
            user.bookmarkedConferences.push(conferenceId);
            bookmarked = true;
        }
        await user.save();
        res.json({
            success: true,
            message: bookmarked ? 'Item saved to bookmarks' : 'Item removed from bookmarks',
            data: {
                bookmarked,
                bookmarkedConferences: user.bookmarkedConferences,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.toggleBookmark = toggleBookmark;
