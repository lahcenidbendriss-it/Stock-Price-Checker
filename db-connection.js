const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB);
        console.log("Database connection successful");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;
