import { Doctor } from "../models/Doctor.js";

export const tempDoctorData = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).limit(10);
        res.status(200).json(doctors);
    } catch (err) {
        console.error("Error fetching doctors:", err);
        res.status(500).json({
            error: "An error occurred while searching for doctors.",
        });
    }
};

// Search function using regex and distance
// export const findDoctor = async (req, res) => {
//     try {
//         const {
//             searchTerm = "",
//             distance,
//             experience,
//             sortBy = "fees",
//             sortDirection = "desc",
//             userLat,
//             userLon,
//             fees,
//         } = req.query;

//         // Build the regex query
//         const query = {
//             $or: [
//                 { specialization: { $regex: new RegExp(searchTerm, "i") } },
//                 { city: { $regex: new RegExp(searchTerm, "i") } },
//                 { doctorName: { $regex: new RegExp(searchTerm, "i") } },
//                 { hospitalName: { $regex: new RegExp(searchTerm, "i") } },
//                 { hospitalAddress: { $regex: new RegExp(searchTerm, "i") } },
//                 { state: { $regex: new RegExp(searchTerm, "i") } },
//                 { country: { $regex: new RegExp(searchTerm, "i") } },
//             ],
//         };

//         // Apply numerical filters
//         const filters = {};

//         // fees range filter
//         if (fees) {
//             filters.fees = { $lte: parseInt(fees) };
//         }

//         // Experience filter
//         if (experience) {
//             filters.experience = { $gte: parseInt(experience) };
//         }

//         // Combine filters with the search query
//         const finalQuery =
//             Object.keys(filters).length > 0
//                 ? { $and: [query, filters] }
//                 : query;

//         // Distance filter
//         if (userLat && userLon && distance) {
//             finalQuery.location = {
//                 $geoWithin: {
//                     $centerSphere: [
//                         [parseFloat(userLon), parseFloat(userLat)], // [longitude, latitude]
//                         parseFloat(distance) / 6371, // Distance in radians (3963.2 is Earth's radius in miles)
//                     ],
//                 },
//             };
//         }

//         // Sorting
//         const sortOptions = {};
//         if (sortBy) {
//             sortOptions[sortBy] = sortDirection === "desc" ? -1 : 1;
//         }

//         // Execute the query
//         const doctors = await Doctor.find(finalQuery)
//             .select("-vector")
//             .sort(sortOptions)
//             .exec();

//         // console.log(doctors);

//         res.status(200).json(doctors);
//     } catch (error) {
//         console.error("Error fetching doctors:", error);
//         res.status(500).json({
//             error: "An error occurred while searching for doctors.",
//         });
//     }
// };

export const findDoctor = async (req, res) => {
    try {
        const {
            searchTerm = "",
            distance,
            experience,
            sortBy = "fees",
            sortDirection = "desc",
            userLat,
            userLon,
            fees,
        } = req.query;

        const query = {
            $or: [
                { specialization: { $regex: new RegExp(searchTerm, "i") } },
                { city: { $regex: new RegExp(searchTerm, "i") } },
                { doctorName: { $regex: new RegExp(searchTerm, "i") } },
                { hospitalName: { $regex: new RegExp(searchTerm, "i") } },
                { hospitalAddress: { $regex: new RegExp(searchTerm, "i") } },
                { state: { $regex: new RegExp(searchTerm, "i") } },
                { country: { $regex: new RegExp(searchTerm, "i") } },
            ],
        };

        const filters = {};
        if (fees) filters.fees = { $lte: parseInt(fees) };
        if (experience) filters.experience = { $gte: parseInt(experience) };

        let finalQuery =
            Object.keys(filters).length > 0
                ? { $and: [query, filters] }
                : query;

        const sortOptions = {};
        if (sortBy && sortBy !== "distance") {
            sortOptions[sortBy] = sortDirection === "desc" ? -1 : 1;
        }

        let doctors;
        if (userLat && userLon) {
            doctors = await Doctor.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [
                                parseFloat(userLon),
                                parseFloat(userLat),
                            ],
                        },
                        distanceField: "distance",
                        maxDistance: distance
                            ? parseFloat(distance) * 1000
                            : 50000000, // Convert to meters
                        query: finalQuery,
                        spherical: true,
                    },
                },
                {
                    $addFields: {
                        distanceInKm: { $divide: ["$distance", 1000] }, // Convert distance to kilometers
                    },
                },
                {
                    $sort:
                        sortBy === "distance"
                            ? {
                                  distanceInKm:
                                      sortDirection === "desc" ? -1 : 1,
                              }
                            : Object.keys(sortOptions).length > 0
                            ? sortOptions
                            : { _id: 1 },
                },
                {
                    $project: {
                        vector: 0, // Exclude the `vector` field
                    },
                },
            ]).exec();
        } else {
            doctors = await Doctor.find(finalQuery)
                .sort(
                    Object.keys(sortOptions).length > 0
                        ? sortOptions
                        : { _id: 1 }
                )
                .exec();
        }

        res.status(200).json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({
            error: "An error occurred while searching for doctors.",
        });
    }
};
