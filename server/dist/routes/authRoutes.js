"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
// Create a new Express Router instance
const router = (0, express_1.Router)();
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController_1.registerUser);
// @route   POST /api/auth/login
// @desc    Login an existing user
// @access  Public
router.post('/login', authController_1.loginUser);
exports.default = router;
