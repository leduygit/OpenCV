import argparse
import json
import torch
from sentence_transformers import SentenceTransformer
import numpy as np

def main(job_details, cv_details, output):
    # Read the job details
    with open(job_details, 'r', encoding='utf-8') as file:
        job_data = json.load(file)

    # Read the cv details
    with open(cv_details, 'r', encoding='utf-8') as file:
        cv_data = json.load(file)

    # Initialize the sentence transformer model
    model = SentenceTransformer('distiluse-base-multilingual-cased-v2')

    # Embbed the CV experience
    cv_embedding = cv_data['experience']
    cv_embedding = model.encode(cv_embedding, convert_to_tensor=True)
    
    # Calculate the similarity between the CV and the job
    similarity = []
    for job in job_data:
        job_embedding = model.encode(job['jd'], convert_to_tensor=True)
        # print(job_embedding.shape)
        # print(cv_embedding.shape)

        similarity.append({
            'title': job['title'],
            'company': job['company'],
            'Salary': job['salary'],
            'Industry': job['industry'],
            'Position': job['position'],
            'Location': job['location'],
            'similarity': torch.nn.functional.cosine_similarity(cv_embedding, job_embedding, dim=0).item()
        })

    # Add top 10 similar jobs to the output
    similarity = sorted(similarity, key=lambda x: x['similarity'], reverse=True)
    with open(output, 'w', encoding='utf-8') as file:
        json.dump(similarity[:10], file, ensure_ascii=False, indent=4)


if __name__ == '__main__':
    # Set up the argument parser
    parser = argparse.ArgumentParser(description='Predict the job embedding')
    parser.add_argument('job_details', type=str, help='The path to the job details file')
    parser.add_argument('cv_details', type=str, help='The path to the cv details file')
    parser.add_argument('output', type=str, help='The path to the output file')

    # Parse the arguments
    args = parser.parse_args()

    # Call the main function
    main(args.job_details, args.cv_details, args.output)

# python predict.py job_details.json cv_details.json output.json
