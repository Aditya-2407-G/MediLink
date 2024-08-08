import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import doctorRoutes from "./routes/doctor.js"



const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));

app.use(cookieParser());
app.use(bodyParser.json());



app.use('/auth', authRoutes);
app.use('/doctor', doctorRoutes);



export default app;