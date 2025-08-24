from PyPDF2 import PdfReader


def extract_text_from_pdf(file_path) -> tuple[list[str], list[dict]]:
    from services.parsers.text_splitter import split_text_into_chunks

    reader = PdfReader(file_path)
    all_chunks = []
    metadata = []

    for page_num, page in enumerate(reader.pages, start=1):
        page_text = page.extract_text()
        if not page_text:
            continue

        chunks = split_text_into_chunks(page_text)
        all_chunks.extend(chunks)
        metadata.extend([{"page_number": page_num, "source": str(file_path)}] * len(chunks))
        

    return all_chunks, metadata
