# server.py
from fastapi import FastAPI, Request, File, UploadFile, Form
from transformers import pipeline
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
    """
    Extracts text from a given file. Supports PDF and DOCX files.

    Args:
        file (UploadFile): The file to extract text from.

    Returns:
        str: The extracted text.

    Raises:
        ValueError: If the file type is not supported.
    """
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
    """
    Generates an embedding for the given text.

    Args:
        text (str): The text to generate an embedding for.

    Returns:
        dict: A dictionary containing the generated embedding.
    """
    data = await request.json()
    text = data["text"]
    embedding = model.encode(text).tolist()  # Generate embedding
    return {"embedding": embedding}


@app.post("/process-cv")
async def process_cv(file: UploadFile = File(...)) -> dict:
    """
    Processes a given CV file and returns the extracted text and its corresponding embedding.

    Args:
        file (UploadFile): The CV file to process.

    Returns:
        dict: A dictionary containing the extracted text and its corresponding embedding.
    """
    # Extract the text from the CV file
    extracted_text = extract_text_from_file(file)

    # Generate an embedding for the extracted text
    embedding = model.encode(extracted_text).tolist()

    # Return the extracted text and its corresponding embedding
    return {"extractedText": extracted_text, "embedding": embedding}


@app.post("/search-jobs")
async def search_jobs(request: Request):
    """
    Searches for jobs based on a given query string.

    Args:
        query (str): The query string to search for.

    Returns:
        dict: A dictionary containing the search results.
    """
    data = await request.json()
    query_text = data["query"]
    print("Query text:", query_text)
    top_k = data.get("top_k", 10)

    # Generate embedding for the query
    query_embedding = model.encode(query_text).tolist()

    # Perform similarity search in Pinecone
    results = index.query(vector=query_embedding, top_k=top_k, include_metadata=True)

    return {"results": results}
