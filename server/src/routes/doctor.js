import express from 'express';
import { register, login, refresh, logout } from "../controllers/authController.js"
import {findDoctor} from "../controllers/doctorController.js"

const router = express.Router();

router.get('/search', findDoctor)


export default router;