import express from 'express';
import { book, upcoming, checkAvailability, cancel } from "../controllers/appointmentController.js"
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/book', auth, book);

router.get('/check-availability',checkAvailability)

router.get('/upcoming', auth, upcoming)

router.get('/cancel', auth, cancel)

export default router;