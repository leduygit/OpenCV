import axios from "axios";
import FormData from "form-data";
import fs from "fs";

/**
 * Sends the file to FastAPI for text extraction and embedding generation.
 *
 * @param {string} filePath Path to the uploaded CV file.
 * @param {string} mimetype File mimetype (e.g., application/pdf).
 * @returns {Promise<{ extractedText: string; embedding: number[] }>} Extracted text and embedding from the server.
 */
export async function processCV(
  filePath: string,
  mimetype: string
): Promise<{ extractedText: string; embedding: number[] }> {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("mimetype", mimetype);

    const response = await axios.post(
      "http://localhost:8000/process-cv",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in processCV:", error);
    throw new Error("Failed to process CV.");
  }
}
