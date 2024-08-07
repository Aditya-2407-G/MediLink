import mongoose from 'mongoose';
import {Doctor} from '../models/Doctor.js';

// Search function using regex
export const findDoctor = async (req, res) => {
    try {
        console.log(req.query)
        const { searchTerm } = req.query;
        console.log(searchTerm)
        // Build the regex query
        const query = {
            $or: [
                { specialization: { $regex: new RegExp(searchTerm, 'i') } },
                { city: { $regex: new RegExp(searchTerm, 'i') } },
                { doctorName: { $regex: new RegExp(searchTerm, 'i') } },
                { hospitalName: { $regex: new RegExp(searchTerm, 'i') } },
                { hospitalAddress: { $regex: new RegExp(searchTerm, 'i') } },
                { state: { $regex: new RegExp(searchTerm, 'i') } },
                { country: { $regex: new RegExp(searchTerm, 'i') } }
            ]
        };
        // Execute the query
        const doctors = await Doctor.find(query);
        console.log(doctors);
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for doctors.' });
    }
};
