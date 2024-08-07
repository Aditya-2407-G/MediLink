import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log(`Mongo Connection success DB HOST ${connectionInstance.connection.host}` );
    } catch (error) {
        console.log("MongoDB connection failed.", error);
        process.exit(1);
    }
}

export default connectDB;