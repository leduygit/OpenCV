# pipeline.py
"""
Pipeline chính cho quy trình phân tích dữ liệu CV và phân cụm công việc.
Dùng để xử lý từ việc làm sạch dữ liệu, trích xuất đặc trưng, vector hóa, 
phân cụm và tạo nhãn mô tả cho từng cụm công việc.

Modules:
    - data_cleaning: Làm sạch dữ liệu, xử lý giá trị thiếu và chuẩn hóa văn bản.
    - feature_extraction: Trích xuất các kỹ năng, bằng cấp, kinh nghiệm từ văn bản.
    - vectorization: Tạo embeddings cho văn bản và thực hiện TF-IDF.
    - clustering: Áp dụng KMeans và DBSCAN, gán nhãn cho các cụm.
    - constants: Chứa các từ dừng tiếng Việt, từ điển kỹ năng, bản đồ ngành nghề và vị trí.
"""

# Import cần thiết
import pandas as pd
from data_cleaning import (
    load_data,
    split_requirements,
    remove_duplicates,
    handle_missing_values,
    apply_text_normalization,
    standardize_salary,
    apply_text_preprocessing,
)
from feature_extraction import apply_extraction, separate_features, normalize_columns
from vectorization import vectorize_data
from clustering import (
    standardize_data,
    find_optimal_kmeans_clusters,
    apply_kmeans,
    apply_dbscan,
    reduce_dimensions,
    visualize_clusters,
    assign_cluster_labels_ngrams,
)
from constants import skill_dict, industry_map, position_map


# Khởi tạo pipeline xử lý chính
def main_pipeline(file_path: str) -> pd.DataFrame:
    """
    Pipeline chính thực hiện các bước từ nạp dữ liệu, làm sạch, trích xuất đặc trưng,
    vector hóa, phân cụm và gán nhãn cho cụm.

    Parameters:
        file_path (str): Đường dẫn đến file JSON chứa dữ liệu.

    Returns:
        pd.DataFrame: DataFrame sau khi thực hiện tất cả các bước tiền xử lý và phân cụm.
    """
    # Step 1: Load và làm sạch dữ liệu
    data = load_data(file_path)
    data = remove_duplicates(data, subset=["title", "company", "jd"])
    data = split_requirements(data)
    data = handle_missing_values(data, important_cols=["industry", "position", "jd"])
    data = apply_text_preprocessing(
        data,
        columns=["title", "company", "industry", "position", "jd", "context", "degree"],
    )
    data = apply_text_normalization(
        data, columns=["title", "company", "industry", "position", "jd"]
    )
    data = standardize_salary(data, salary_col="salary")

    # Step 2: Trích xuất kỹ năng và chuẩn hóa cột ngành nghề/vị trí
    data = apply_extraction(data, columns=["context", "jd"], skill_dict=skill_dict)
    # data = separate_features(data, column="skills")
    data = normalize_columns(data, industry_map=industry_map, position_map=position_map)

    # Save data
    data.to_csv("./data/job_preprocessed.csv", index=False)

    # Step 3: Vector hóa các đặc trưng bằng embedding và TF-IDF
    embed_fields = [
        "jd",
        # "skills",
        # "context",
        # "title",
        # "company",
        # "industry",
        # "position",
    ]
    tfidf_fields = ["industry_position"]
    data["industry_position"] = (
        data["industry"].fillna("") + " " + data["position"].fillna("")
    )
    data = vectorize_data(
        data,
        embed_fields=embed_fields,
        tfidf_fields=tfidf_fields,
        embedding_max_length=256,
        embedding_batch_size=32,
        tfidf_max_features=50,
        pca_components=50,
    )

    # Step 4: Phân cụm với KMeans và DBSCAN
    pca_columns = [col for col in data.columns if "embedding_pca" in col]
    data_scaled = standardize_data(data, pca_columns)

    # KMeans clustering với số cluster tối ưu
    best_k = find_optimal_kmeans_clusters(data_scaled)
    data = apply_kmeans(data, data_scaled, n_clusters=best_k)
    print(f"Optimal number of clusters for KMeans: {best_k}")

    # DBSCAN clustering
    data = apply_dbscan(data, data_scaled, eps=0.5, min_samples=5)

    # Step 5: Giảm chiều và trực quan hóa
    pca_2d = reduce_dimensions(data_scaled, n_components=2)
    data["pca_1"], data["pca_2"] = pca_2d[:, 0], pca_2d[:, 1]
    visualize_clusters(
        data,
        "kmeans_cluster",
        f"KMeans Clustering Visualization (Optimal n_clusters={best_k})",
    )
    visualize_clusters(
        data, "dbscan_cluster", "DBSCAN Clustering Visualization (2D PCA)"
    )

    # Step 6: Gán nhãn cho các cụm với bigrams/trigrams
    kmeans_labels = assign_cluster_labels_ngrams(data, "kmeans_cluster")
    data["kmeans_job_category"] = data["kmeans_cluster"].map(kmeans_labels)

    dbscan_labels = assign_cluster_labels_ngrams(
        data[data["dbscan_cluster"] != -1], "dbscan_cluster"
    )
    data["dbscan_job_category"] = (
        data["dbscan_cluster"].map(dbscan_labels).fillna("Noise")
    )

    return data


# Chạy pipeline và lưu kết quả
if __name__ == "__main__":
    processed_data = main_pipeline("job_details.json")
    processed_data.to_csv("job_details_labeled_final.csv", index=False)
    print("Pipeline completed and results saved.")
