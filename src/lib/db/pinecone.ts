// /lib/db/pinecone.ts
import { Pinecone } from "@pinecone-database/pinecone";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY as string;

if (!PINECONE_API_KEY) {
  throw new Error(
    "Please define PINECONE_API_KEY and PINECONE_ENVIRONMENT in your .env file"
  );
}

const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});


export { pinecone };
