import { Router } from 'express';
import { getTrains, getTrainById, createTrain } from '../controllers/trainController';
import protect, { admin } from '../middleware/protect';

const router = Router();

// @route   GET /api/trains
// @desc    Get all trains or search
// @access  Public
router.get('/', getTrains);

// @route   GET /api/trains/:id
// @desc    Get train by ID
// @access  Public
router.get('/:id', getTrainById);

// @route   POST /api/trains
// @desc    Create a new train
// @access  Private/Admin
router.post('/', protect, admin, createTrain);

export default router;
