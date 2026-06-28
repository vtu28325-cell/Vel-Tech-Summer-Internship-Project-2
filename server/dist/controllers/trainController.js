"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrain = exports.getTrainById = exports.getTrains = void 0;
const Train_1 = __importDefault(require("../models/Train"));
// @desc    Get all trains or search trains by source, destination, and date
// @route   GET /api/trains
// @access  Public
const getTrains = async (req, res) => {
    try {
        const { source, destination, date } = req.query;
        // Build query object based on provided search params
        const query = {};
        if (source)
            query.source = { $regex: new RegExp(source, 'i') }; // Case-insensitive match
        if (destination)
            query.destination = { $regex: new RegExp(destination, 'i') };
        if (date)
            query['schedule.date'] = date;
        const trains = await Train_1.default.find(query).select('-seats'); // Don't return all 500+ seat objects for basic search
        res.status(200).json(trains);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.getTrains = getTrains;
// @desc    Get single train details by ID
// @route   GET /api/trains/:id
// @access  Public
const getTrainById = async (req, res) => {
    try {
        const train = await Train_1.default.findById(req.params.id);
        if (!train) {
            res.status(404).json({ message: 'Train not found' });
            return;
        }
        res.status(200).json(train);
    }
    catch (error) {
        res.status(500).json({ message: 'Invalid train ID or Server Error' });
    }
};
exports.getTrainById = getTrainById;
// @desc    Create a new train
// @route   POST /api/trains
// @access  Private/Admin
const createTrain = async (req, res) => {
    try {
        const { trainNumber, trainName, source, destination, schedule, totalSeats, fare, duration, trainType, } = req.body;
        const trainExists = await Train_1.default.findOne({ trainNumber });
        if (trainExists) {
            res.status(400).json({ message: 'Train with this number already exists' });
            return;
        }
        const train = await Train_1.default.create({
            trainNumber,
            trainName,
            source,
            destination,
            schedule,
            totalSeats,
            fare,
            duration,
            trainType,
        });
        res.status(201).json(train);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.createTrain = createTrain;
