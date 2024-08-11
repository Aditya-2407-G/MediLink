import mongoose, { Schema } from "mongoose";

const doctorSchema = Schema(
    {
        // reference to the user who is a doctor
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        doctorName: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        hospitalName: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        hospitalAddress: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        specialization: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        fees: {
            type: Number,
            default: 0,
        },

        city: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        state: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        country: {
            type: String,
            required: true,
            min: 6,
            max: 255,
        },

        // MongoDB accessible location of doctor
        location: {
            type: { type: String },
            coordinates: [Number],
        },

        //text embedded vector of doctor for search purpose
        vector: {
            type: [Number],
            required: true,
        },

        licence: {
            type: String,
            required: true,
        },

        experience: {
            type: Number,
            required: true,
        },

        // give random profile photo to user temporarily
        profilePhoto: {
            type: String,
            required: true,
            default: () =>
                `https://randomuser.me/api/portraits/men/${Math.floor(
                    Math.random() * 100
                )}.jpg`,
        },
    },
    { strict: false },
    { timestamp: true } 
);

// create 2d sphere index for location
doctorSchema.index({ location: "2dsphere" });

export const Doctor = mongoose.model("Doctor", doctorSchema);
