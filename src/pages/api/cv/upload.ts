// /pages/api/cv/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authMiddleware";
import multer from "multer";
import path from "path";
import fs from "fs";
import connectToDatabase from "../../../lib/db/mongodb";
import { CVModel } from "../../../lib/models/CV";
import { processCV } from "@/lib/services/cvProcessor";
import { pineconeIndex } from "../../../lib/db/pinecone";
import { runMiddleware } from "@/middleware/runMiddleware";

interface NextAPIUploadCVRequest extends NextApiRequest {
  user: {
    id: string;
  };
  file: Express.Multer.File; // Sử dụng đúng kiểu cho Multer file
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "cvs");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const reqWithUser = req as NextAPIUploadCVRequest;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      reqWithUser.user.id + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only PDF and DOCX are allowed."));
    }
    cb(null, true);
  },
});

/**
 * Handles API requests to upload a new CV
 *
 * This API endpoint is responsible for handling the upload of a new CV to the
 * server. It uses Multer to handle the file upload, and then uses FastAPI to
 * process the CV and extract the text and embedding. The extracted text and
 * embedding are then saved to MongoDB and Pinecone, respectively.
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @returns {Promise<void>}
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Connecting to database...");
    await connectToDatabase();

    console.log("Running middleware...");
    await runMiddleware(req, res, upload.single("file"));

    const reqWithFile = req as NextAPIUploadCVRequest;
    const { path: filePath, mimetype } = reqWithFile.file;

    // Save CV information to MongoDB
    const cv = new CVModel({
      userId: reqWithFile.user.id,
      filePath,
      fileFormat: mimetype,
      uploadedAt: new Date(),
    });

    console.log("Processing CV with FastAPI...");
    /**
     * Calls the FastAPI endpoint to process the CV and extract the text and
     * embedding. The endpoint returns an object with the following properties:
     *
     * - extractedText: The extracted text from the CV
     * - embedding: The embedding of the CV
     */
    const { extractedText, embedding } = await processCV(filePath, mimetype);
    cv.parsedContent = extractedText;
    // Uncomment the following line to save the CV to MongoDB
    await cv.save();

    console.log("Saving embedding to Pinecone...");
    /**
     * Calls the Pinecone upsert endpoint to save the embedding of the CV to
     * Pinecone. The endpoint takes an array of objects with the following
     * properties:
     *
     * - id: The ID of the CV
     * - values: The embedding of the CV
     * - metadata: An object with the following properties:
     *   - userId: The ID of the user who uploaded the CV
     *   - uploadedAt: The timestamp when the CV was uploaded
     */
    await pineconeIndex.upsert([
      {
        id: cv._id.toString(),
        values: embedding,
        metadata: {
          userId: reqWithFile.user.id,
          uploadedAt: cv.uploadedAt.toISOString(),
        },
      },
    ]);

    console.log("Cleaning up file...");
    // Remove the uploaded file from the server
    fs.unlinkSync(filePath);

    return res.status(200).json({
      message: "CV uploaded and processed successfully.",
      cv,
      embedding,
    });
  } catch (error) {
    console.error("Error processing CV:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to use multer
  },
};

export default authenticate(handler);
