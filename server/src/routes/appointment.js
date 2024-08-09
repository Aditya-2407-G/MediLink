import express from 'express';
import { book } from "../controllers/appointmentController.js"
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/book', book);

export default router;