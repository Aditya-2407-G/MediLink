import mongoose, { Schema } from "mongoose";
// Define the doctor schema
const doctorSchema = Schema(
    {
        // Reference to the user who is a doctor
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Doctor's name
        doctorName: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        // Hospital where the doctor practices
        hospitalName: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        // Address of the hospital
        hospitalAddress: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        // Doctor's specialization
        specialization: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        // Doctor's consultation fees
        fees: {
            type: Number,
            default: 0,
        },

        // City where the doctor is located
        city: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        // State where the doctor is located
        state: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        // Country where the doctor is located
        country: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        // Latitude of the doctor's location
        latitude: {
            type: Number,
            required: true,
        },

        // Longitude of the doctor's location
        longitude: {
            type: Number,
            required: true,
        },

        //Text embedded vector of doctor for search purpose
        vector: {
            type: [Number],
            required: true,
        },
    },
    { strict: false },
    { timestamp: true } // Allow fields not specified in the schema
);

// Export the Doctor model based on the schema
export const Doctor = mongoose.model("Doctor", doctorSchema);
