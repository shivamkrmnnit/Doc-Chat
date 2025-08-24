
def extract_text_from_txt(file_path) -> tuple[list[str], list[dict]]:
    from services.parsers.text_splitter import split_text_into_chunks

    with open(file_path, "r", encoding="utf-8") as file:
        full_text = file.read()

    chunks = split_text_into_chunks(full_text)
    metadata = [{"section": "txt_start"}] * len(chunks)
    return chunks, metadata
