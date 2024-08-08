import express from 'express';
import {findDoctor, tempDoctorData} from "../controllers/doctorController.js"

const router = express.Router();

router.get('/search', findDoctor)

router.get('/temp-doctor-data', tempDoctorData)

export default router;