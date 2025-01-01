# server.py
from fastapi import FastAPI, Request, File, UploadFile, Form, HTTPException
import pdfplumber
import mammoth
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from pinecone import Pinecone
import os

load_dotenv(".env.local")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(name=PINECONE_INDEX_NAME)

app = FastAPI()

# Load the pipeline
model = SentenceTransformer("CrazyDave53/OpenCV-finetuned")


def extract_text_from_file(file: UploadFile) -> str:
    if file.filename.endswith(".pdf"):
        # Open the PDF file using pdfplumber
        with pdfplumber.open(file.file) as pdf:
            # Extract the text from each page of the PDF
            text = "".join([page.extract_text() for page in pdf.pages])
    elif file.filename.endswith(".docx"):
        # Extract the text from the DOCX file using mammoth
        result = mammoth.extract_raw_text(file)
        text = result.value
    else:
        # Raise an error if the file type is not supported
        raise ValueError("Unsupported file type")
    return text


@app.post("/embed")
async def embed(request: Request):
    data = await request.json()
    text = data["text"]
    embedding = model.encode(text).tolist()  # Generate embedding
    return {"embedding": embedding}


@app.post("/process-cv")
async def process_cv(file: UploadFile = File(...)) -> dict:
    # Extract the text from the CV file
    extracted_text = extract_text_from_file(file)

    # Generate an embedding for the extracted text
    embedding = model.encode(extracted_text).tolist()

    # Return the extracted text and its corresponding embedding
    return {"extractedText": extracted_text, "embedding": embedding}


@app.post("/search-jobs")
async def search_jobs(request: Request):
    data = await request.json()
    query_text = data["query"]
    print("Query text:", query_text)
    top_k = data.get("top_k", 10)

    # Generate embedding for the query
    query_embedding = model.encode(query_text).tolist()

    # Perform similarity search in Pinecone
    results = index.query(
        vector=query_embedding, top_k=top_k, include_metadata=True, namespace="jobs"
    )

    return {"results": results}


@app.post("/upsert-job")
async def upsert_job(request: Request):
    try:
        data = await request.json()
        job_id = data["job_id"]
        combined_text = data["combined_text"]
        metadata = data.get("metadata", {})

        if not job_id or not combined_text:
            raise HTTPException(
                status_code=400, detail="job_id and combined_text are required."
            )

        # Generate embedding for the job
        embedding = model.encode(combined_text).tolist()

        # Upsert the embedding into Pinecone
        index.upsert(
            vectors=[
                {
                    "id": job_id,
                    "values": embedding,
                    "metadata": metadata,
                }
            ],
            namespace="jobs",
        )

        return {"message": "Job data upserted successfully.", "job_id": job_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error upserting job: {str(e)}")


@app.post("/recommend-jobs")
async def recommend_jobs(request: Request):
    try:
        # Parse request body
        data = await request.json()
        cv_id = data.get("cvId")
        top_k = data.get("top_k", 10)

        # Validate input
        if not cv_id:
            raise HTTPException(status_code=400, detail="cvId is required.")

        # Fetch CV embedding from Pinecone
        print(f"Fetching CV embedding for {cv_id}...")
        fetch_result = index.fetch(ids=[cv_id])

        # Debug fetch result
        # print(f"Fetch result: {fetch_result}")

        # Validate embedding exists in fetch_result
        embedding_data = fetch_result.get("vectors", {}).get(cv_id)
        if not embedding_data or "values" not in embedding_data:
            raise HTTPException(
                status_code=404, detail=f"Embedding not found for cvId: {cv_id}"
            )

        cv_embedding = embedding_data["values"]

        # Perform similarity search in Pinecone
        print("Querying Pinecone for similar jobs...")
        query_results = index.query(
            vector=cv_embedding,
            top_k=top_k,
            include_metadata=True,
            namespace="jobs",
        )

        # Check if there are matches
        if not query_results.matches:
            return {"matches": []}

        # Format matches for response
        matches = [
            {"id": match.id, "score": match.score} for match in query_results.matches
        ]
        return {"matches": matches}

    except Exception as e:
        print(f"Error in recommend_jobs: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error processing recommendations: {str(e)}"
        )
