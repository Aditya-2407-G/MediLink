import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctor.js';
import appointmentRoutes from './routes/appointment.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, 
}));

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/doctor', doctorRoutes);
app.use('/appointment', appointmentRoutes);

export default app;
