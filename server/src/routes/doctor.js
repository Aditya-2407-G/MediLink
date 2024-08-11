import express from 'express';
import {findDoctor, aiSeek} from "../controllers/doctorController.js"

const router = express.Router();

router.get('/search', findDoctor)

router.get('/ai-seek',aiSeek)


export default router;