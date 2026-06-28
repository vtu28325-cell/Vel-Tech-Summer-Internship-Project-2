"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI || '');
        console.log(`🍃[database]: MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`⚠️[database]: MongoDB Connection Failed: ${error.message}`);
        console.log(`⚠️[database]: Server will run in OFFLINE mode (database functions won't work).`);
    }
};
exports.default = connectDB;
