"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
const seedAdmin = async () => {
    try {
        await (0, db_1.default)();
        const email = 'admin@trainbook.com';
        const existingAdmin = await User_1.default.findOne({ email });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit();
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash('admin123', salt);
        await User_1.default.create({
            name: 'Super Admin',
            email: email,
            password: hashedPassword,
            role: 'admin',
        });
        console.log('Admin user seeded successfully!');
        console.log('Email: admin@trainbook.com');
        console.log('Password: admin123');
        process.exit();
    }
    catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};
seedAdmin();
