import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { createAccessToken, createRefreshToken } from "../utils/token.js";
import { Doctor } from "../models/Doctor.js";

// function to generate text embeddings using hugging face inference API
// async function generateEmbeddings(text) {
//     console.log(JSON.stringify({ inputs: text }));
//     const response = await fetch(
//         "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
//         {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 inputs: {
//                     source_sentence: text,
//                     sentences: [text],
//                 },
//             }),
//         }
//     );
//     const data = await response.json();
//     console.log("RESPONSE: ", data);

//     if (!response.ok) {
//         throw new Error(`Error fetching embeddings: ${response.statusText}`);
//     }

//     return data;
// }

// function to register user, both doctor and patient
// export const register = async (req, res) => {
//     try {
//         const {
//             name,
//             email,
//             password,
//             role,
//             hospitalName,
//             hospitalAddress,
//             specialization,
//             fees,
//             city,
//             state,
//             country,
//             latitude,
//             longitude,
//             licence,
//             experience,
//         } = req.body;

//         // return with status code 400 if any field is empty
//         if ([name, email, password].some((field) => field?.trim() === "")) {
//             return res.status(400).json({ message: "Please Fill All Fields" });
//         }

//         // check if email is already taken
//         const existedUser = await User.findOne({ email });

//         // if it exists, return with status code 400
//         if (existedUser) {
//             return res
//                 .status(400)
//                 .json({ message: "User with same email already exists" });
//         }

//         // hash password for security
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({
//             name,
//             email,
//             password: hashedPassword,
//             role,
//         });

//         // save user
//         await user.save();

//         // create a doctor if role selected is doctor
//         if (role.toLowerCase() === "doctor") {
//             const doctorText = `Doctor ${name} specializing in ${specialization} sits at ${hospitalName} ${hospitalAddress} ${city} ${state} ${country}`;
//             // generate embeddings using the python script
//             const vector = await generateEmbeddings(doctorText);

//             const doctor = new Doctor({
//                 user_id: user._id,
//                 doctorName: name,
//                 hospitalName,
//                 hospitalAddress,
//                 specialization,
//                 fees,
//                 city,
//                 state,
//                 country,
//                 location: {
//                     type: "Point",
//                     coordinates: [parseFloat(longitude), parseFloat(latitude)], // [longitude, latitude]
//                 },
//                 vector,
//                 licence,
//                 experience: parseInt(experience),
//             });

//             // save the doctor
//             await doctor.save();
//             return res
//                 .status(201)
//                 .json({ message: "Doctor Registered Successfully" });
//         }
//         return res.status(201).json({ message: "User Created Successfully" });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Error Creating User" });
//     }
// };

// new code here 
export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            hospitalName,
            hospitalAddress,
            specialization,
            fees,
            city,
            state,
            country,
            latitude,
            longitude,
            licence,
            experience,
        } = req.body;

        // return with status code 400 if any field is empty
        if ([name, email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "Please Fill All Fields" });
        }

        // check if email is already taken
        const existedUser = await User.findOne({ email });

        // if it exists, return with status code 400
        if (existedUser) {
            return res
                .status(400)
                .json({ message: "User with same email already exists" });
        }

        // hash password for security
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // save user
        await user.save();

        // create a doctor if role selected is doctor
        if (role.toLowerCase() === "doctor") {
            const description = `Doctor ${name} specializing in ${specialization} sits at ${hospitalName} ${hospitalAddress} ${city} ${state} ${country}`;

            const doctor = new Doctor({
                user_id: user._id,
                doctorName: name,
                hospitalName,
                hospitalAddress,
                specialization,
                fees,
                city,
                state,
                country,
                location: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)], // [longitude, latitude]
                },
                description,
                licence,
                experience: parseInt(experience),
            });

            // save the doctor
            await doctor.save();
            return res
                .status(201)
                .json({ message: "Doctor Registered Successfully" });
        }
        return res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error Creating User" });
    }
};

// function that handles user login, doctor and patient
export const login = async (req, res) => {
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
            const doctor = await Doctor.findOne({ user_id: userObj._id });

            if (doctor) {
                console.log("Doctor found: ", doctor);
                // convert doctor document to plain object and merge with user
                userObj = { ...userObj, ...doctor.toObject() };
                console.log("USER HERE IS: ", userObj);
            }
        }

        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                id: userObj._id,
                name: userObj.name,
                email: userObj.email,
                role: userObj.role,
                // include doctor details if available
                doctorDetails: userObj.doctorName
                    ? {
                          doctorName: userObj.doctorName,
                          hospitalName: userObj.hospitalName,
                          hospitalAddress: userObj.hospitalAddress,
                          specialization: userObj.specialization,
                          fees: userObj.fees,
                          city: userObj.city,
                          state: userObj.state,
                          country: userObj.country,
                          licence: userObj.licence,
                          experience: userObj.experience,
                      }
                    : null,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Logging In" });
    }
};

// function that handles refresh, manages session by checking refresh token and returning access token based on conditions
export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.headers;

        if (!refreshToken) {
            return res.status(403).json({ message: "User Not Authenticated" });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.EXPO_PUBLIC_REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(403).json({ message: "User Not Found" });
        }

        const newToken = createAccessToken(user);
        const newRefreshToken = createRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.status(200).json({
            accessToken: newToken,
            refreshToken: newRefreshToken,
            message: "Token Refreshed Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Refreshing Token" });
    }
};

// function that handles user logout
export const logout = async (req, res) => {
    try {
        const userId = req.user.userId;

        await User.findByIdAndUpdate(
            { _id: userId },
            { $unset: { refreshToken: 1 } }
        );

        res.status(200).json({ message: "User Logged Out Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Logging Out" });
    }
};
