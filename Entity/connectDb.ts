// db.js
import mongoose from "mongoose";
import "dotenv/config";

const mongourl: string = process.env.MONGOURL ?? "url";

console.log({ mongourl });

const connectDB = async () => {
  try {
    await mongoose.connect(mongourl, {
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    console.log("Database connected successfully");
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
