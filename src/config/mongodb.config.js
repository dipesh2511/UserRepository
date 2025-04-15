import mongoose from "mongoose";

const mongodbUri = process.env.MONGODB_URI;
export const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongodbUri, {
      dbName: process.env.DB_NAME,
    });
    console.log(
      `Connected to MongoDB database successfully on db url ${mongodbUri}`
    );
  } catch (error) {
    console.error("Error connecting to MongoDB database:", error.message);
    process.exit(1);
  }
};
