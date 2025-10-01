import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/systemdesign");
export default mongoose.connection; 