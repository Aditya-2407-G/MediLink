import dotenv from "dotenv"
import connectDB from "./db/db.js";
import app from "./app.js";

dotenv.config({
    path: '../.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server started on PORT ${process.env.PORT || 8000}`)
    })
})
.catch((error) => {
    console.log("Server failed to start, MongoDB connection failed!!!", error)
    process.exit(1)
})
