import { Doctor } from "../models/Doctor.js";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

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

async function generateEmbeddings(text) {
    try {
        const env = { ...process.env, HF_HUB_DISABLE_SYMLINKS_WARNING: "1" };
        const { stdout, stderr } = await execPromise(
            `call ../.venv/Scripts/activate && python ./src/utils/generate_embeddings.py "${text}"`,
            { env }
        );
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return null;
        }
        const vector = JSON.parse(stdout);
        if (
            !Array.isArray(vector) ||
            !vector.every((num) => typeof num === "number")
        ) {
            throw new Error("Invalid vector format");
        }
        return vector;
    } catch (error) {
        console.error(`Exec error: ${error}`);
        return null;
    }
}


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

        const queryVector = await generateEmbeddings(text);
        if (!queryVector) {
            return res
                .status(500)
                .json({ error: "Failed to generate embeddings" });
        }

        // Step 1: Perform vector search
        const vectorSearchResults = await Doctor.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "vector",
                    queryVector: queryVector,
                    numCandidates: 100,
                    limit: 3,
                },
            },
            {
                $addFields: {
                    score: { $meta: "vectorSearchScore" },
                },
            },
            {
                $project: {
                    vector: 0, // Exclude vector from results
                },
            },
        ]).exec();

        // Extract the IDs of the doctors found in the vector search
        const doctorIds = vectorSearchResults.map((doc) => doc._id);

        // Step 2: Apply geospatial filtering on the candidates
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
                    query: { _id: { $in: doctorIds } }, // Filter by the IDs from the vector search
                },
            },
            {
                $addFields: {
                    distanceInKm: { $multiply: ["$distance", (0.001)] }, // Convert distance to kilometers
                },
            },
            {
                $project: {
                    distance: 1, // Include distance in the result
                    distanceInKm: 1, // Include distance in km
                    score: 1, // Include vector search score
                    doctorName: 1, // Include other necessary fields
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

        // Combine the vector search results with geo-filtered results
        const finalResults = vectorSearchResults.map(result => {
            const geoResult = geoFilteredResults.find(geoRes => geoRes._id.equals(result._id));
            return {
                ...result,
                distance: geoResult?.distance,
                distanceInKm: geoResult?.distanceInKm,
            };
        });

        // Return the final results
        return res.status(200).json(finalResults);
    } catch (error) {
        console.error(`Error in aiSeek: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

