import pandas as pd
import numpy as np
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from sklearn.feature_extraction.text import CountVectorizer
from typing import List, Dict
import matplotlib.pyplot as plt
import seaborn as sns


def standardize_data(data: pd.DataFrame, columns: List[str]) -> np.ndarray:
    """
    Chuẩn hóa dữ liệu embedding dựa trên các cột PCA.

    Parameters:
        data (pd.DataFrame): Dữ liệu đầu vào.
        columns (List[str]): Các cột chứa embedding PCA.

    Returns:
        np.ndarray: Dữ liệu chuẩn hóa.
    """
    scaler = StandardScaler()
    return scaler.fit_transform(data[columns])


def find_optimal_kmeans_clusters(
    data: np.ndarray, k_range: range = range(2, 11)
) -> int:
    """
    Tìm số lượng clusters tối ưu cho KMeans bằng silhouette score.

    Parameters:
        data (np.ndarray): Dữ liệu đầu vào đã chuẩn hóa.
        k_range (range): Dải giá trị của k để thử nghiệm.

    Returns:
        int: Số lượng clusters tối ưu.
    """
    best_k, best_score = k_range.start, -1
    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=42)
        clusters = kmeans.fit_predict(data)
        score = silhouette_score(data, clusters)
        if score > best_score:
            best_k, best_score = k, score
    return best_k


def apply_kmeans(
    data: pd.DataFrame, data_scaled: np.ndarray, n_clusters: int
) -> pd.DataFrame:
    """
    Áp dụng KMeans với số lượng cluster tối ưu và lưu vào DataFrame.

    Parameters:
        data (pd.DataFrame): Dữ liệu đầu vào.
        data_scaled (np.ndarray): Dữ liệu chuẩn hóa.
        n_clusters (int): Số lượng clusters tối ưu cho KMeans.

    Returns:
        pd.DataFrame: Dữ liệu với cột KMeans cluster.
    """
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    data["kmeans_cluster"] = kmeans.fit_predict(data_scaled)
    return data


def apply_dbscan(
    data: pd.DataFrame, data_scaled: np.ndarray, eps: float = 0.5, min_samples: int = 5
) -> pd.DataFrame:
    """
    Áp dụng DBSCAN để phân cụm và lưu vào DataFrame.

    Parameters:
        data (pd.DataFrame): Dữ liệu đầu vào.
        data_scaled (np.ndarray): Dữ liệu chuẩn hóa.
        eps (float): Bán kính tìm kiếm lân cận trong DBSCAN.
        min_samples (int): Số điểm tối thiểu trong vùng lân cận để tạo cluster.

    Returns:
        pd.DataFrame: Dữ liệu với cột DBSCAN cluster.
    """
    dbscan = DBSCAN(eps=eps, min_samples=min_samples)
    data["dbscan_cluster"] = dbscan.fit_predict(data_scaled)
    return data


def reduce_dimensions(data_scaled: np.ndarray, n_components: int = 2) -> np.ndarray:
    """
    Giảm chiều dữ liệu bằng PCA để trực quan hóa.

    Parameters:
        data_scaled (np.ndarray): Dữ liệu đã chuẩn hóa.
        n_components (int): Số thành phần PCA cho mục đích trực quan hóa.

    Returns:
        np.ndarray: Dữ liệu sau khi giảm chiều bằng PCA.
    """
    pca = PCA(n_components=n_components)
    return pca.fit_transform(data_scaled)


def visualize_clusters(data: pd.DataFrame, cluster_column: str, title: str):
    """
    Trực quan hóa phân cụm bằng matplotlib và seaborn.

    Parameters:
        data (pd.DataFrame): Dữ liệu đầu vào.
        cluster_column (str): Tên cột chứa kết quả phân cụm.
        title (str): Tiêu đề của biểu đồ.
    """
    plt.figure(figsize=(12, 6))
    sns.scatterplot(
        data=data,
        x="pca_1",
        y="pca_2",
        hue=cluster_column,
        palette="viridis",
        style=cluster_column,
        s=60,
    )
    plt.title(title)
    plt.legend(title=cluster_column)
    plt.show()


def assign_cluster_labels_ngrams(
    data: pd.DataFrame, cluster_column: str, n_top_ngrams: int = 2
) -> Dict[int, str]:
    """
    Gán nhãn cho các cluster dựa trên bigram và trigram phổ biến nhất từ tiêu đề công việc.

    Parameters:
        data (pd.DataFrame): Dữ liệu chứa tiêu đề công việc và kết quả phân cụm.
        cluster_column (str): Tên cột chứa kết quả phân cụm.
        n_top_ngrams (int): Số lượng n-gram phổ biến nhất.

    Returns:
        Dict[int, str]: Bản đồ giữa số cluster và nhãn mô tả.
    """
    cluster_labels = {}
    for cluster in data[cluster_column].unique():
        if cluster == -1:  # Bỏ qua noise trong DBSCAN
            continue
        cluster_titles = data[data[cluster_column] == cluster]["title"]
        vectorizer = CountVectorizer(ngram_range=(2, 3), stop_words="english")
        ngram_matrix = vectorizer.fit_transform(cluster_titles)
        sum_ngrams = ngram_matrix.sum(axis=0)
        ngrams_freq = [
            (ngram, sum_ngrams[0, idx]) for ngram, idx in vectorizer.vocabulary_.items()
        ]
        sorted_ngrams = sorted(ngrams_freq, key=lambda x: x[1], reverse=True)
        common_ngrams = [ngram for ngram, freq in sorted_ngrams[:n_top_ngrams]]
        cluster_labels[cluster] = " / ".join(common_ngrams).title()
    return cluster_labels
