from pathlib import Path
from typing import List

PARSED_DIRECTORY = Path("/parsed/")

def search_parsed_text(user_id: str, query: str) -> List[str]:
    user_dir = PARSED_DIRECTORY / user_id
    if not user_dir.exists():
        raise ValueError(f"No parsed files found for user: {user_id}")

    results = []
    for file_path in user_dir.glob("*.txt"):
        with file_path.open("r", encoding="utf-8") as file:
            content = file.read()
            if query.lower() in content.lower():
                results.append(f"Match found in {file_path.name}")

    return results if results else ["No matches found"]
