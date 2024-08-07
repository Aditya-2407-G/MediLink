import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { createAccessToken, createRefreshToken } from "../utils/token.js";
import { Doctor } from '../models/Doctor.js';

export const register = async (req, res) => {
    console.log("Regiester function called");
    try {
        const { name, email, password, role, hospitalName, hospitalAddress, specialization, fees, city, state, country } = req.body;

        if ([name, email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "Please Fill All Fields" });
        }

        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.status(400).json({ message: "User with same email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await user.save();

        if (role.toLocaleLowerCase() === "doctor") {
            console.log("We are adding doctor");
            const doctor = new Doctor({
                user_id: user._id,
                doctorName: name,
                hospitalName,
                hospitalAddress,
                specialization,
                fees,
                city,
                state,
                country
            });
            await doctor.save();
            return res.status(201).json({ message: "Doctor Registered Successfully" });
        }
        // Send response only once
        return res.status(201).json({ message: "User Created Successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error Creating User" });
    }
};


export const login = async (req, res) => {
    console.log("Sign in called");
    try {
        const { email, password } = req.body;

        if ([email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "Please Fill All Fields" });
        }

        let user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        let userObj = user.toObject(); // Convert user document to plain object

        if (userObj.role.toLowerCase() === "doctor") {
            console.log("User is a doctor");
            const doctor = await Doctor.findOne({ user_id: userObj._id });

            if (doctor) {
                console.log("Doctor found: ", doctor);
                // Convert doctor document to plain object and merge with user
                userObj = { ...userObj, ...doctor.toObject() };
                console.log("USER HERE IS: ", userObj);
            }
        }

        const options = {
            httpOnly: true,
            secure: true,
        };
        
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                accessToken,
                refreshToken,
                user: {
                    id: userObj._id,
                    name: userObj.name,
                    email: userObj.email,
                    role: userObj.role,
                    // Include doctor details if available
                    doctorDetails: userObj.doctorName ? {
                        doctorName: userObj.doctorName,
                        hospitalName: userObj.hospitalName,
                        hospitalAddress: userObj.hospitalAddress,
                        specialization: userObj.specialization,
                        fees: userObj.fees,
                        city: userObj.city,
                        state: userObj.state,
                        country: userObj.country,
                    } : null,
                },
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Logging In" });
    }
};

export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(403).json({ message: "User Not Authenticated" });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(403).json({ message: "User Not Found" });
        }

        const newToken = createAccessToken(user);
        const newRefreshToken = createRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        const options = {
            httpOnly: true,
            secure: true,
        };

        res.status(200)
            .cookie("accessToken", newToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({ message: "Token Refreshed Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Refreshing Token" });
    }
};

export const logout = async (req, res) => {
    try {
        const userId = req.user.userId;

        await User.findByIdAndUpdate(
            { _id: userId },
            { $unset: { refreshToken: 1 } }
        );

        res.status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json({ message: "User Logged Out Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Logging Out" });
    }
};
