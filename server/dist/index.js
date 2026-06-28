"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const trainRoutes_1 = __importDefault(require("./routes/trainRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
// Load environment variables from .env file
dotenv_1.default.config();
// Connect to Database
(0, db_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware Setup
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)()); // Enable CORS for frontend requests
app.use(express_1.default.json()); // Parse JSON request bodies
app.use((0, morgan_1.default)('dev')); // Request logging in console
// Basic Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Train Ticket Booking API is running!',
    });
});
// API Routes
app.use('/api/auth', authRoutes_1.default); // Authentication endpoints
app.use('/api/trains', trainRoutes_1.default); // Train search and management
app.use('/api/bookings', bookingRoutes_1.default); // Booking endpoints
// Start the server
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
