import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import adminRouter from "./modules/Admin/route";
import communicateRouter from "./modules/Communicate/Route";
import infoGatheringRouter from "./modules/InfoGathering/Controller";
import cors from "cors";
dotenv.config();
const app = express();
const port = 5001;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../uploads")));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.get("/chatbot/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});


app.use("/chatbot/api/v1/info", infoGatheringRouter);
app.use("/chatbot/api/v1/admin", adminRouter);
app.use("/chatbot/api/v1/communicate", communicateRouter);

app.listen(port, () => {
  console.info("sever is running on ", port);
});
