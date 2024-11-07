"""
Install the Google AI Python SDK

$ pip install google-generativeai
"""

import google.generativeai as genai
from pypdf import PdfReader

def extract_job_description_from_pdf(pdf_path, api_key):
    # Cấu hình API key
    genai.configure(api_key=api_key)
    
    # Đọc file PDF
    try:
        reader = PdfReader(pdf_path)
        page = reader.pages[0]

        # Trích xuất văn bản từ trang đầu tiên
        text = page.extract_text()
        
        # Cấu hình mô hình sinh nội dung
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
        )

        # Tạo prompt để mô hình trích xuất thông tin
        prompt = f"""
        The following text is a job description extracted from a document. Please extract the following fields from it:
        - position
        - address
        - requirements (degree, experience, skills, certifications)
        - work mode: full-time, part-time, remote
        - career objectives
        Provide the output in a JSON format.

        Text: 
        {text}
        """

        contents = [text, prompt]

        # Gọi mô hình để sinh nội dung
        response = model.generate_content(contents)
        return response.text
    
    except FileNotFoundError:
        return "Error: PDF file not found."
    except Exception as e:
        return f"Error: {str(e)}"

# Sử dụng hàm
api_key = "AIzaSyBafTEjz4CeGhDUw0jG4J7Gw2CF9qBpFoU"  # Thay bằng API key thật
pdf_path = './ImageTest/cvExample.pdf'  # Đường dẫn đến file PDF
output = extract_job_description_from_pdf(pdf_path, api_key)
print(output)
