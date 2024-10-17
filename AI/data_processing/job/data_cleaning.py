import pandas as pd
import numpy as np
import re
from typing import Optional, List
from constants import stop_words_vi


def load_data(file_path: str) -> pd.DataFrame:
    """
    Load dữ liệu từ file JSON và trả về DataFrame.

    Parameters:
    file_path (str): Đường dẫn tới file JSON.

    Returns:
    pd.DataFrame: Dữ liệu được đọc từ file.
    """
    try:
        data = pd.read_json(file_path)
        print(f"Data loaded successfully with {data.shape[0]} records.")
        return data
    except Exception as e:
        print("Error loading data:", e)
        return pd.DataFrame()


# Function to normalize 'experience' field into numerical format
def normalize_experience(experience: str) -> float:
    """
    Converts experience text into a numerical format.
    Examples:
    - "3-5 Năm" becomes 4 (average of range)
    - "Trên 2 năm" becomes 2
    - "Không yêu cầu kinh nghiệm" becomes 0
    """
    if not isinstance(experience, str):
        return np.nan

    # Remove unwanted characters and standardize format
    experience = experience.lower().strip()

    if "không yêu cầu" in experience:
        return 0  # No experience required
    elif "trên" in experience:
        # Extract the first number following 'trên'
        min_exp = re.findall(r"\d+", experience)
        return float(min_exp[0]) if min_exp else np.nan
    elif "-" in experience:
        # Handle range format "3-5 Năm"
        range_exp = [int(num) for num in re.findall(r"\d+", experience)]
        if len(range_exp) == 2:
            return sum(range_exp) / 2  # Average of the range
        elif range_exp:
            return float(range_exp[0])
    else:
        # Single numeric value for experience
        single_exp = re.findall(r"\d+", experience)
        return float(single_exp[0]) if single_exp else np.nan


def split_requirements(data: pd.DataFrame) -> pd.DataFrame:
    """
    Splits the 'requirements' column into 'degree', 'experience', and 'context' columns.
    Normalizes and cleans the text data for better readability and consistency.
    """
    # Extract degree, experience, and context
    data["degree"] = data["requirements"].apply(
        lambda x: x.get("degree", "") if isinstance(x, dict) else ""
    )
    data["experience"] = data["requirements"].apply(
        lambda x: x.get("experience", "") if isinstance(x, dict) else ""
    )
    data["context"] = data["requirements"].apply(
        lambda x: x.get("context", "") if isinstance(x, dict) else ""
    )

    # Clean the text for better readability (stripping unnecessary spaces, new lines, etc.)
    data["degree"] = data["degree"].str.strip()
    data["experience"] = (
        data["experience"].str.replace(r"\s+", " ", regex=True).str.strip()
    )

    data["experience"] = data["experience"].apply(normalize_experience)
    data["context"] = data["context"].str.replace(r"\s+", " ", regex=True).str.strip()

    # Drop the original 'requirements' column for clarity
    data = data.drop(columns=["requirements"])

    return data


def remove_duplicates(
    data: pd.DataFrame, subset: Optional[List[str]] = None
) -> pd.DataFrame:
    """
    Loại bỏ các bản ghi trùng lặp trong DataFrame.

    Parameters:
    data (pd.DataFrame): DataFrame đầu vào.
    subset (List[str], optional): Danh sách các cột để kiểm tra trùng lặp. Nếu không chỉ định, kiểm tra toàn bộ cột.

    Returns:
    pd.DataFrame: DataFrame sau khi đã loại bỏ trùng lặp.
    """
    initial_count = data.shape[0]
    data = data.drop_duplicates(subset=subset) if subset else data.drop_duplicates()
    print(f"Removed {initial_count - data.shape[0]} duplicate records.")
    return data


def handle_missing_values(
    data: pd.DataFrame, important_cols: List[str]
) -> pd.DataFrame:
    """
    Xử lý các bản ghi có dữ liệu thiếu trong các cột quan trọng.

    Parameters:
    data (pd.DataFrame): DataFrame đầu vào.
    important_cols (List[str]): Danh sách các cột quan trọng.

    Returns:
    pd.DataFrame: DataFrame sau khi xử lý các bản ghi thiếu.
    """
    initial_count = data.shape[0]
    data = data.dropna(subset=important_cols)
    print(
        f"Removed {initial_count - data.shape[0]} records with missing values in important columns."
    )
    return data


import spacy

nlp = spacy.load("xx_sent_ud_sm")

import xx_sent_ud_sm

nlp = xx_sent_ud_sm.load()


# Hàm tiền xử lý văn bản
def preprocess_text(text: str) -> str:
    """
    Loại bỏ từ dừng cho văn bản tiếng Việt.

    Parameters:
    text (str): Chuỗi văn bản cần xử lý.

    Returns:
    str: Chuỗi văn bản sau khi loại bỏ từ dừng.
    """
    if not isinstance(text, str):
        return text
    doc = nlp(text)
    # Giữ lại token không nằm trong stop_words_vi
    return " ".join(
        [token.text for token in doc if token.text.lower() not in stop_words_vi]
    )


# Hàm áp dụng tiền xử lý văn bản cho các cột trong DataFrame
def apply_text_preprocessing(data: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
    """
    Áp dụng tiền xử lý văn bản cho các cột được chỉ định.

    Parameters:
    data (pd.DataFrame): DataFrame đầu vào.
    columns (List[str]): Danh sách các cột cần tiền xử lý văn bản.

    Returns:
    pd.DataFrame: DataFrame sau khi áp dụng tiền xử lý.
    """
    for col in columns:
        data[col] = data[col].apply(preprocess_text)
    print(f"Text preprocessing applied on columns: {columns}")
    return data


def normalize_text_vietnamese(text: str) -> str:
    """
    Xóa ký tự đặc biệt không thuộc bảng mã tiếng Việt và chuyển đổi văn bản về chữ thường.

    Parameters:
    text (str): Chuỗi văn bản cần xử lý.

    Returns:
    str: Chuỗi văn bản sau khi xử lý.
    """
    if isinstance(text, str):
        text = re.sub(
            r"[^a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]",
            "",
            text,
        )
        return text.lower().strip()
    return text


def apply_text_normalization(data: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
    """
    Áp dụng việc chuẩn hóa văn bản cho các cột nhất định.

    Parameters:
    data (pd.DataFrame): DataFrame đầu vào.
    columns (List[str]): Danh sách các cột cần chuẩn hóa văn bản.

    Returns:
    pd.DataFrame: DataFrame sau khi chuẩn hóa.
    """
    for col in columns:
        data[col] = data[col].apply(normalize_text_vietnamese)
    print(f"Text normalization applied on columns: {columns}")
    return data


def standardize_salary(data: pd.DataFrame, salary_col: str) -> pd.DataFrame:
    """
    Chuẩn hóa cột mức lương thành một dạng thống nhất (giả định là VND).

    Parameters:
    data (pd.DataFrame): DataFrame đầu vào.
    salary_col (str): Tên cột chứa thông tin mức lương.

    Returns:
    pd.DataFrame: DataFrame sau khi chuẩn hóa mức lương.
    """

    def parse_salary(salary: str) -> Optional[float]:
        # Sử dụng regex để lấy mức lương thấp nhất từ khoảng lương hoặc bỏ qua nếu không khả dụng
        match = re.search(r"(\d+)", salary.replace(",", ""))
        return float(match.group(1)) if match else np.nan

    data[salary_col] = data[salary_col].apply(parse_salary)
    print(f"Standardized salary data in column: {salary_col}")
    return data


# Hàm pipeline chính để thực hiện các bước tiền xử lý dữ liệu
def data_preprocessing_pipeline(file_path: str) -> pd.DataFrame:
    """
    Thực hiện toàn bộ quy trình tiền xử lý dữ liệu bao gồm nạp dữ liệu, làm sạch và chuẩn hóa.

    Parameters:
    file_path (str): Đường dẫn đến file JSON chứa dữ liệu.

    Returns:
    pd.DataFrame: DataFrame sau khi tiền xử lý.
    """
    data = load_data(file_path)
    data = split_requirements(data)
    data = remove_duplicates(data, subset=["title", "company", "jd"])
    data = handle_missing_values(data, important_cols=["industry", "position", "jd"])
    data = apply_text_preprocessing(
        data,
        columns=["title", "company", "industry", "position", "jd", "context", "degree"],
    )
    data = apply_text_normalization(
        data, columns=["title", "company", "industry", "position", "jd"]
    )
    data = standardize_salary(data, salary_col="salary")
    return data
