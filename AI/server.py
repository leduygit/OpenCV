from fastapi import FastAPI, Request, File, UploadFile, Form
from transformers import pipeline
import pdfplumber
import mammoth

app = FastAPI()

# Load the pipeline
model = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")


def extract_text_from_pdf(file):
    with pdfplumber.open(file.file) as pdf:
        text = "".join([page.extract_text() for page in pdf.pages])
    return text


def extract_text_from_docx(file):
    result = mammoth.extract_raw_text(file)
    return result.value


@app.post("/embed")
async def embed(request: Request):
    data = await request.json()
    text = data["text"]
    embedding = model(text)[0]  # Generate embedding
    return {"embedding": embedding}


@app.post("/process-cv")
async def process_cv(file: UploadFile = File(...), mimetype: str = Form(...)):
    if mimetype == "application/pdf":
        print("Extract pdf")
        extracted_text = extract_text_from_pdf(file)
    elif mimetype in [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
    ]:
        extracted_text = extract_text_from_docx(file)
    else:
        return {"error": "Unsupported file type"}

    # Generate embedding
    embedding = model(extracted_text)[0]
    return {"extractedText": extracted_text, "embedding": embedding}
