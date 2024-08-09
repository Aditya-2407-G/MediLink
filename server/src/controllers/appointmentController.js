import { Appointment } from "../models/Appointment.js"; // Replace with your actual model path

export const book = async (req, res) => {
    const { doctor_id, appointmentDate, timeSlot } = req.body;

    try {
        // Check if the requested time slot is already booked
        const existingAppointment = await Appointment.findOne({
            doctor_id: doctor_id,
            appointmentDate: appointmentDate,
            timeSlot: timeSlot,
        });

        // If an appointment exists, return an error response
        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message:
                    "The selected time slot is already booked. Please choose another time.",
            });
        }

        // If no overlapping appointment, create a new appointment
        const newAppointment = new Appointment({
            doctor_id: doctor_id,
            appointmentDate: appointmentDate,
            timeSlot: timeSlot,
            user_id: req.user.userId,
        });

        await newAppointment.save();

        // Step 4: Return a success response
        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully.",
            appointment: newAppointment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message:
                "An error occurred while booking the appointment. Please try again later.",
        });
    }
};

export const checkAvailability = async (req, res) => {
    try {
        const { doctor_id, date } = req.query;

        // Find all appointments that match the doctor_id and appointmentDate
        const appointments = await Appointment.find(
            { doctor_id: doctor_id, appointmentDate: date },
            { timeSlot: 1, _id: 0 }
        );

        // Return the matched appointments
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({
            message: "Server error. Could not check availability.",
        });
    }
};

export const upcoming = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            user_id: req.user.userId,
        })
            .populate({
                path: "doctor_id",
                select: "-vector", 
            })
            .sort({ appointmentDate: 1, timeSlot: 1 })
            .exec();
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const cancel = async (req, res) => {
    try {
        console.log(req.query)
        const appointmentId = req.query.appointmentId; 
        // Extract ID from query parameters
        if (!appointmentId) {
            return res.status(400).json({ message: "Appointment ID is required." });
        }

        const result = await Appointment.deleteOne({ _id: appointmentId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        res.status(200).json({ message: "Appointment cancelled successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
