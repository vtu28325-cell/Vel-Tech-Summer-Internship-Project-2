"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// @desc    Protect routes — only logged-in users can access
// @usage   Add as middleware in any route: router.get('/profile', protect, getProfile)
const protect = async (req, res, next) => {
    let token;
    // JWT tokens are sent in the Authorization header as "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token after the "Bearer " prefix
            token = req.headers.authorization.split(' ')[1];
            // Verify the token using our secret key
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'supersecretkey12345');
            // Find the user in the database using the ID stored in the token payload
            // We select all fields except the password for security
            req.user = await User_1.default.findById(decoded.id).select('-password');
            // Token is valid — pass control to the next handler
            next();
        }
        catch (error) {
            // Token is invalid or expired
            res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    }
    if (!token) {
        // No token was found in the request header at all
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};
// @desc    Admin middleware — only users with role 'admin' can access
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
exports.admin = admin;
exports.default = protect;
