import express from 'express';
import {findDoctor, tempDoctorData, aiSeek} from "../controllers/doctorController.js"

const router = express.Router();

router.get('/search', findDoctor)

router.get('/ai-seek',aiSeek)

router.get('/temp-doctor-data', tempDoctorData)

export default router;