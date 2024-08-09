import { Appointment } from "../models/Appointment.js";// Replace with your actual model path

export const book = async (req, res) => {
    const { doctorId, appointmentDate, timeSlot } = req.body;

    try {
        // Check if the requested time slot is already booked
        const existingAppointment = await Appointment.findOne({
            doctorId: doctorId,
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
            doctorId: doctorId,
            appointmentDate: appointmentDate,
            timeSlot: timeSlot,
            userId: req.user.id, // Assuming you're using authentication and req.user contains the logged-in user's ID
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
