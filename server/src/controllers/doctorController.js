import { Doctor } from "../models/Doctor.js";

// function that finds doctor based on search results
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
                            : 50000, // Convert to meters
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

// function to generate text embeddings using hugging face inference API
async function generateEmbeddings(text) {
    console.log(JSON.stringify({ inputs: text }));
    const response = await fetch(
        "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: {
                    source_sentence: text,
                    sentences: [text],
                },
            }),
        }
    );
    const data = await response.json();
    console.log("RESPONSE: ", data);

    if (!response.ok) {
        throw new Error(`Error fetching embeddings: ${response.statusText}`);
    }

    return data;
}

// function that handles vector search to give results of doctors based on search queries
// export const aiSeek = async (req, res) => {
//     try {
//         const text = req.query.text;
//         const userLat = req.query.latitude;
//         const userLon = req.query.longitude;

//         if (!text) {
//             return res
//                 .status(400)
//                 .json({ error: "Text query parameter is required" });
//         }

//         const queryVector = await generateEmbeddings(text);
//         if (!queryVector) {
//             return res
//                 .status(500)
//                 .json({ error: "Failed to generate embeddings" });
//         }

//         // Step 1: Perform vector search
//         const vectorSearchResults = await Doctor.aggregate([
//             {
//                 $vectorSearch: {
//                     index: "vector_index",
//                     path: "vector",
//                     queryVector: queryVector,
//                     numCandidates: 100,
//                     limit: 3,
//                 },
//             },
//             {
//                 $addFields: {
//                     score: { $meta: "vectorSearchScore" },
//                 },
//             },
//             {
//                 $project: {
//                     vector: 0, // Exclude vector from results
//                 },
//             },
//         ]).exec();

//         // Extract the IDs of the doctors found in the vector search
//         const doctorIds = vectorSearchResults.map((doc) => doc._id);

//         // Step 2: Apply geospatial filtering on the candidates
//         const geoFilteredResults = await Doctor.aggregate([
//             {
//                 $geoNear: {
//                     near: {
//                         type: "Point",
//                         coordinates: [parseFloat(userLon), parseFloat(userLat)],
//                     },
//                     distanceField: "distance",
//                     maxDistance: 50000000, // 50,000 km as default max distance
//                     spherical: true,
//                     query: { _id: { $in: doctorIds } }, // Filter by the IDs from the vector search
//                 },
//             },
//             {
//                 $addFields: {
//                     distanceInKm: { $multiply: ["$distance", (0.001)] }, // Convert distance to kilometers
//                 },
//             },
//             {
//                 $project: {
//                     distance: 1, // Include distance in the result
//                     distanceInKm: 1, // Include distance in km
//                     score: 1, // Include vector search score
//                     doctorName: 1, // Include other necessary fields
//                     hospitalName: 1,
//                     hospitalAddress: 1,
//                     specialization: 1,
//                     fees: 1,
//                     city: 1,
//                     state: 1,
//                     country: 1,
//                     location: 1,
//                     licence: 1,
//                     experience: 1,
//                     profilePhoto: 1,
//                 },
//             },
//         ]).exec();

//         // Combine the vector search results with geo-filtered results
//         const finalResults = vectorSearchResults.map(result => {
//             const geoResult = geoFilteredResults.find(geoRes => geoRes._id.equals(result._id));
//             return {
//                 ...result,
//                 distance: geoResult?.distance,
//                 distanceInKm: geoResult?.distanceInKm,
//             };
//         });

//         // Return the final results
//         return res.status(200).json(finalResults);
//     } catch (error) {
//         console.error(`Error in aiSeek: ${error}`);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// };

//new code here
export const aiSeek = async (req, res) => {
    try {
        const text = req.query.text;
        const userLat = req.query.latitude;
        const userLon = req.query.longitude;

        if (!text) {
            return res
                .status(400)
                .json({ error: "Text query parameter is required" });
        }

        // fetch all doctors
        const doctors = await Doctor.find().exec(); // Fetch all doctors with their descriptions

        // prepare sentences for API request
        const sentences = doctors.flatMap((doctor) => doctor.description || `Doctor ${doctor.name} specializing in ${doctor.specialization} sits at ${doctor.hospitalName} ${doctor.hospitalAddress} ${doctor.city} ${doctor.state} ${doctor.country}`);

        console.log(
            "Input being passed is",
            JSON.stringify({
                inputs: {
                    source_sentence: text,
                    sentences: sentences,
                },
            })
        );

        // get similarity scores from Hugging Face API
        const response = await fetch(
            "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: {
                        source_sentence: text,
                        sentences: sentences,
                    },
                }),
            }
        );

        if (!response.ok) {
            throw new Error(
                `Error fetching similarity scores: ${response.statusText}`
            );
        }
        const scores= await response.json(); // Adjust based on the actual API response
        console.log(scores);

        // combine scores with doctor data
        const doctorsWithScores = doctors.map((doctor, index) => ({
            ...doctor.toObject(),
            score: scores[index], // Attach the similarity score
        }));

        // sort doctors by similarity score in descending order
        const sortedDoctors = doctorsWithScores.sort(
            (a, b) => b.score - a.score
        );

        // apply geospatial filtering on top results
        const topDoctorsIds = sortedDoctors.slice(0, 3).map((doc) => doc._id); // Limit to top 10 for geo-filtering

        console.log(topDoctorsIds);

        const geoFilteredResults = await Doctor.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(userLon), parseFloat(userLat)],
                    },
                    distanceField: "distance",
                    maxDistance: 50000000, // 50,000 km as default max distance
                    spherical: true,
                    query: { _id: { $in: topDoctorsIds } }, // Filter by the IDs from the top results
                },
            },
            {
                $addFields: {
                    distanceInKm: { $multiply: ["$distance", 0.001] }, // Convert distance to kilometers
                },
            },
            {
                $project: {
                    distance: 1, 
                    distanceInKm: 1, 
                    score: 1, 
                    doctorName: 1, 
                    hospitalName: 1,
                    hospitalAddress: 1,
                    specialization: 1,
                    fees: 1,
                    city: 1,
                    state: 1,
                    country: 1,
                    location: 1,
                    licence: 1,
                    experience: 1,
                    profilePhoto: 1,
                },
            },
        ]).exec();

        // return the final results with both score and geo data
        return res.status(200).json(geoFilteredResults);
    } catch (error) {
        console.error(`Error in aiSeek: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
