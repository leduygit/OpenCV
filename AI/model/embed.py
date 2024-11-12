import json
import torch
from sentence_transformers import SentenceTransformer
import numpy as np



if __name__ == '__main__':
    # Read the job details
    with open('job_details.json', 'r', encoding='utf-8') as file:
        job_data = json.load(file)

    # Open a json to write the embeddings
    job_embedding_file = open('job_embedding.json', 'w', encoding='utf-8')

    # Initialize the sentence transformer model
    model = SentenceTransformer('distiluse-base-multilingual-cased-v2')

    job_embedding = []
    cnt = 0
    for job in job_data:
        # cnt += 1
        # if cnt == 1000:
        #     break
        # print("cnt: ", cnt) 
        # print(f"Title: {job['title']}")
        # print(f"Company: {job['company']}")
        # print(f"Image URL: {job['image_url']}")
        # print(f"Salary: {job['salary']}")
        # print(f"Industry: {job['industry']}")
        # print(f"Position: {job['position']}")
        # print(f"Location: {job['location']}")
        
        # # Print job requirements
        # requirements = job['requirements']
        # print("Requirements:")
        # print(f"  Degree: {requirements['degree']}")
        # print(f"  Experience: {requirements['experience']}")
        # if requirements['context']:
        #     print(f"  Context: {requirements['context']}")
        
        # # Print job description
        # print("Job Description:")
        # print(job['jd'])
        # print("\n" + "="*50 + "\n")

        embeddings = model.encode(job['jd'], convert_to_tensor=True)
        job_embedding.append({
            'title': job['title'],
            'company': job['company'],
            'Salary': job['salary'],
            'Industry': job['industry'],
            'Position': job['position'],
            'Location': job['location'],
            'embedding': embeddings.cpu().numpy().tolist()
        })

    job_embedding_file.write(json.dumps(job_embedding, ensure_ascii=False, indent=4))

    job_embedding_file.close()

    


