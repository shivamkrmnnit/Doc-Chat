from docx import Document

def extract_text_from_docx(file_path) -> tuple[list[str], list[dict]]:
    from services.parsers.text_splitter import split_text_into_chunks

    doc = Document(file_path)
    full_text = "\n".join(p.text for p in doc.paragraphs)
    chunks = split_text_into_chunks(full_text)
    metadata = [{"section": "doc_start"}] * len(chunks)
    return chunks, metadata
