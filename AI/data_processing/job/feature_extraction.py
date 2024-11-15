import re
from typing import List, Optional
import pandas as pd

import spacy

nlp = spacy.load("xx_sent_ud_sm")

import xx_sent_ud_sm

nlp = xx_sent_ud_sm.load()


def extract_requirements(
    text: str,
    skill_dict: Optional[List[str]] = None,
    ner_method: str = "spacy",
) -> List[str]:
    """
    Trích xuất kỹ năng, bằng cấp và kinh nghiệm từ văn bản mô tả công việc.

    Parameters:
        text (str): Văn bản chứa yêu cầu công việc.
        skill_dict (List[str], optional): Danh sách các kỹ năng chuẩn.
        ner_method (str): Phương pháp NER ("spacy" hoặc "underthesea").

    Returns:
        List[str]: Danh sách các yêu cầu được trích xuất.
    """
    if not isinstance(text, str):
        return []

    extracted = set()

    # Sử dụng phương pháp NER theo tùy chọn
    if ner_method == "spacy":
        doc = nlp(text)
        extracted.update(
            ent.text
            for ent in doc.ents
            if ent.label_ in ["SKILL", "PRODUCT", "ORG", "PERSON"]
        )
    # elif ner_method == "underthesea":
    #     ner_results = ner(text)
    #     extracted.update(result[0] for result in ner_results if result[3] in ["B-SKILL", "B-ORG", "B-PER"])

    # Trích xuất dựa trên từ điển kỹ năng
    if skill_dict:
        text_lower = text.lower()
        extracted.update(skill for skill in skill_dict if skill.lower() in text_lower)

    # Kiểm tra các mẫu kinh nghiệm và bằng cấp trong văn bản
    experience_patterns = [
        r"\d+\s*năm kinh nghiệm",
        r"kinh nghiệm\s*\d+\s*năm",
        r"tốt nghiệp đại học",
        r"bằng cử nhân",
        r"bằng thạc sĩ",
        r"bằng tiến sĩ",
    ]
    extracted.update(
        [
            match
            for pattern in experience_patterns
            for match in re.findall(pattern, text, re.IGNORECASE)
        ]
    )

    return list(extracted)


def apply_extraction(
    data: pd.DataFrame,
    columns: List[str],
    skill_dict: Optional[List[str]] = None,
    ner_method: str = "spacy",
) -> pd.DataFrame:
    """
    Áp dụng trích xuất yêu cầu cho các cột nhất định trong DataFrame.

    Parameters:
        data (pd.DataFrame): Dữ liệu gốc.
        columns (List[str]): Danh sách các cột cần áp dụng trích xuất.
        skill_dict (List[str], optional): Danh sách kỹ năng chuẩn.
        ner_method (str): Phương pháp NER ("spacy" hoặc "underthesea").

    Returns:
        pd.DataFrame: DataFrame sau khi áp dụng trích xuất.
    """
    data["combined_text"] = data[columns].apply(
        lambda row: " ".join(row.values.astype(str)), axis=1
    )
    print(data["combined_text"].head())
    data["skills"] = data["combined_text"].apply(
        lambda x: extract_requirements(x, skill_dict, ner_method)
    )
    return data.drop(columns=["combined_text"])


def separate_features(data: pd.DataFrame, column: str) -> pd.DataFrame:
    """
    Phân loại danh sách yêu cầu trong cột thành kỹ năng, bằng cấp và kinh nghiệm.

    Parameters:
        data (pd.DataFrame): Dữ liệu gốc.
        column (str): Cột chứa danh sách yêu cầu.

    Returns:
        pd.DataFrame: DataFrame sau khi tách thành các cột kỹ năng, bằng cấp và kinh nghiệm.
    """
    data["skills"] = data[column].apply(
        lambda x: [req for req in x if "skill" in req.lower()]
    )
    data["degrees"] = data[column].apply(
        lambda x: [req for req in x if "degree" in req.lower()]
    )
    data["experience"] = data[column].apply(
        lambda x: [req for req in x if "experience" in req.lower()]
    )
    return data


def normalize_columns(
    data: pd.DataFrame, industry_map: dict, position_map: dict
) -> pd.DataFrame:
    """
    Chuẩn hóa ngành nghề và vị trí công việc trong DataFrame.

    Parameters:
        data (pd.DataFrame): Dữ liệu gốc.
        industry_map (dict): Bản đồ chuẩn hóa ngành nghề.
        position_map (dict): Bản đồ chuẩn hóa vị trí công việc.

    Returns:
        pd.DataFrame: DataFrame đã chuẩn hóa.
    """
    data["industry"] = data["industry"].map(industry_map).fillna(data["industry"])
    data["position"] = data["position"].map(position_map).fillna(data["position"])
    return data
