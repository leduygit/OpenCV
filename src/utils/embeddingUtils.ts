// /lib/utils/embeddingUtils.ts
import axios from "axios";

/**
 * Generates a feature embedding for the input text using the specified model.
 * Loads the model lazily using the loadModel() function.
 *
 * @param {string} text The input text to generate an embedding for.
 * @returns {Promise<number[]>} A promise that resolves to the generated embedding.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Assume output is a tensor, convert it to array
  const response = await axios.post("http://127.0.0.1:8000/embed", { text });
  const embedding = response.data["embedding"];
  console.log("Embedding generated:", embedding);
  return embedding;
}
