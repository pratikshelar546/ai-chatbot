import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { InfoGatheringService } from "./service";
import { authenticateUser } from "../../middleware/verifyUser";
import fs from "fs";
import PdfParse from "pdf-parse";
import { readFromPdf } from "./aiLogic";

const router = Router();
const service = new InfoGatheringService();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx", ".txt"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed."
        )
      );
    }
  },
});

// Extend Request type to include file property
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

router.post(
  "/addDocument",
  authenticateUser,
  upload.single("document"),
  async (req: RequestWithFile, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No document file uploaded" });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "chatbot/documents",
      });

      // Extract content from file (you might want to parse PDF/DOC content here)
      const content = `Document uploaded: ${req.file.originalname}`;

      const newDocument = await service.addDocumentWithFile({
        title: req.file.originalname,
        content: content,
        category: "uploaded",
        fileName: req.file.filename,
        originalName: req.file.originalname,
        cloudinaryUrl: result.secure_url,
      });

      // read the pdf and store vetors in qdrant db and then delete the file from the server
      const readPdf = await readFromPdf(req.file.path);

      res.status(200).json({
        message: "Document added successfully",
        fileName: req.file.filename,
        originalName: req.file.originalname,
        cloudinaryUrl: result.secure_url,
        document: newDocument,
      });
    } catch (error) {
      res.status(500).json({
        message: `Error uploading file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  }
);

export default router;
