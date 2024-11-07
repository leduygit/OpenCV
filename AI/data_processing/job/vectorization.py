import pandas as pd
import numpy as np
import torch
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import PCA
from transformers import AutoTokenizer, AutoModel
from typing import List, Optional

# Load model and tokenizer (shared resource across functions)
tokenizer = AutoTokenizer.from_pretrained("vinai/phobert-base")
model = AutoModel.from_pretrained("vinai/phobert-base")


def embed_text_batch(
    texts: List[str],
    max_length: int = 256,
    batch_size: int = 32,
) -> np.ndarray:
    """
    Chuyển đổi danh sách văn bản thành embeddings.

    Parameters:
        texts (List[str]): Danh sách các chuỗi văn bản.
        max_length (int): Độ dài tối đa của mỗi chuỗi khi embedding.
        batch_size (int): Kích thước batch khi embedding.

    Returns:
        np.ndarray: Ma trận embeddings với mỗi hàng là embedding của một văn bản.
    """
    all_embeddings = []
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i : i + batch_size]
        inputs = tokenizer(
            batch_texts,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=max_length,
        )
        with torch.no_grad():
            outputs = model(**inputs)
        embeddings = outputs.last_hidden_state[:, 0, :].cpu().numpy()  # CLS token
        all_embeddings.extend(embeddings)
    return np.array(all_embeddings)


def apply_embeddings(
    data: pd.DataFrame,
    fields: List[str],
    embedding_max_length: int,
    embedding_batch_size: int,
) -> pd.DataFrame:
    """
    Áp dụng embedding lên các cột văn bản chỉ định và thêm chúng vào DataFrame.

    Parameters:
        data (pd.DataFrame): Dữ liệu gốc.
        fields (List[str]): Danh sách các cột cần áp dụng embedding.
        embedding_max_length (int): Độ dài tối đa cho mỗi chuỗi khi embedding.
        embedding_batch_size (int): Kích thước batch khi embedding.

    Returns:
        pd.DataFrame: Dữ liệu sau khi thêm các embedding.
    """
    for field in fields:
        embeddings = embed_text_batch(
            data[field].fillna("").astype(str).tolist(),
            max_length=embedding_max_length,
            batch_size=embedding_batch_size,
        )
        embedding_df = pd.DataFrame(
            embeddings,
            columns=[f"{field}_embedding_{i}" for i in range(embeddings.shape[1])],
        )
        data = pd.concat([data.reset_index(drop=True), embedding_df], axis=1)
        print(f"Embedding applied to field: {field}")
    return data


def apply_tfidf(
    data: pd.DataFrame, fields: List[str], max_features: int = 50
) -> pd.DataFrame:
    """
    Áp dụng TF-IDF lên các cột văn bản và thêm các đặc trưng vào DataFrame.

    Parameters:
        data (pd.DataFrame): Dữ liệu gốc.
        fields (List[str]): Danh sách các cột cần áp dụng TF-IDF.
        max_features (int): Số đặc trưng tối đa cho mỗi trường.

    Returns:
        pd.DataFrame: Dữ liệu sau khi thêm các đặc trưng TF-IDF.
    """
    for field in fields:
        vectorizer = TfidfVectorizer(max_features=max_features)
        tfidf_matrix = vectorizer.fit_transform(data[field].fillna(""))
        tfidf_df = pd.DataFrame(
            tfidf_matrix.toarray(),
            columns=[f"{field}_tfidf_{i}" for i in range(tfidf_matrix.shape[1])],
        )
        data = pd.concat([data.reset_index(drop=True), tfidf_df], axis=1)
        print(f"TF-IDF applied to field: {field}")
    return data


def reduce_dimensions(
    data: pd.DataFrame, embedding_columns: List[str], n_components: int = 50
) -> pd.DataFrame:
    """
    Giảm chiều các embedding với PCA.

    Parameters:
        data (pd.DataFrame): Dữ liệu gốc chứa các embedding.
        embedding_columns (List[str]): Danh sách các cột embedding cần giảm chiều.
        n_components (int): Số thành phần chính sau khi giảm chiều với PCA.

    Returns:
        pd.DataFrame: Dữ liệu sau khi giảm chiều với PCA.
    """
    embeddings = data[embedding_columns].values
    pca = PCA(n_components=n_components)
    reduced_embeddings = pca.fit_transform(embeddings)
    reduced_df = pd.DataFrame(
        reduced_embeddings, columns=[f"embedding_pca_{i}" for i in range(n_components)]
    )
    return pd.concat([data.reset_index(drop=True), reduced_df], axis=1)


def vectorize_data(
    data: pd.DataFrame,
    embed_fields: List[str],
    tfidf_fields: List[str],
    embedding_max_length: int = 256,
    embedding_batch_size: int = 32,
    tfidf_max_features: int = 50,
    pca_components: int = 50,
) -> pd.DataFrame:
    """
    Thực hiện toàn bộ quá trình embedding, TF-IDF và giảm chiều.

    Parameters:
        data (pd.DataFrame): Dữ liệu gốc.
        embed_fields (List[str]): Danh sách các cột cần áp dụng embedding.
        tfidf_fields (List[str]): Danh sách các cột cần áp dụng TF-IDF.
        embedding_max_length (int): Độ dài tối đa cho mỗi chuỗi khi embedding.
        embedding_batch_size (int): Kích thước batch khi embedding.
        tfidf_max_features (int): Số đặc trưng tối đa cho TF-IDF.
        pca_components (int): Số thành phần chính sau khi giảm chiều với PCA.

    Returns:
        pd.DataFrame: Dữ liệu sau khi áp dụng toàn bộ quy trình vectorization.
    """
    data = apply_embeddings(
        data, embed_fields, embedding_max_length, embedding_batch_size
    )
    print("Completed embedding step.")

    data = apply_tfidf(data, tfidf_fields, max_features=tfidf_max_features)
    print("Completed TF-IDF step.")

    embedding_columns = [col for col in data.columns if "embedding" in col]
    if embedding_columns:
        data = reduce_dimensions(data, embedding_columns, n_components=pca_components)
        print("Completed PCA step.")
    return data
