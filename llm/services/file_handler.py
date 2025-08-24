import requests
from pathlib import Path
from urllib.parse import unquote
import logging
from services.parsers import pdf_parser, docx_parser, txt_parser, pptx_parser

# Setup directories
UPLOAD_DIR = Path("/uploads/")
PARSED_DIR = Path("/parsed/")
UPLOAD_DIR.mkdir(exist_ok=True)
PARSED_DIR.mkdir(exist_ok=True)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def is_url(file_path_or_url: str) -> bool:
    """Check if the input is a URL."""
    return file_path_or_url.startswith("http://") or file_path_or_url.startswith("https://")

def process_file(file_path: Path) -> tuple[list[str], list[dict]]:
    """Process a file based on its extension."""
    ext = file_path.suffix.lower()
    if ext == ".pdf":
        return pdf_parser.extract_text_from_pdf(file_path)
    elif ext == ".docx":
        return docx_parser.extract_text_from_docx(file_path)
    elif ext == ".txt":
        return txt_parser.extract_text_from_txt(file_path)
    elif ext == ".pptx":
        return pptx_parser.extract_text_from_pptx(file_path)
    else:
        raise Exception(f"Unsupported file type: {ext}")
    
def download_and_extract(file_path_or_url: str) -> tuple[list[str], list[dict]]:
    try:
        if is_url(file_path_or_url):
            # Handle URL input
            logger.info(f"Downloading file from {file_path_or_url}")
            response = requests.get(file_path_or_url, stream=True)

            if response.status_code != 200:
                raise Exception(f"Failed to download file. HTTP Status: {response.status_code}")

            # Decode and validate file name
            file_name = unquote(file_path_or_url.split("/")[-1])
            if ".." in file_name or "/" in file_name:
                raise Exception("Invalid file name.")

            # Save the file
            file_path = UPLOAD_DIR / file_name
            with open(file_path, "wb") as f:
                f.write(response.content)

            logger.info(f"File downloaded and saved as {file_path}")
        else:
            # Handle local file input
            file_path = Path(file_path_or_url)
            if not file_path.exists():
                raise FileNotFoundError(f"File not found: {file_path}")
            file_name = file_path.name
            logger.info(f"Processing local file: {file_path}")

        # Process the file
        chunks, metadata = process_file(file_path)

        # ✅ Ensure filename is present in each metadata entry
        for meta in metadata:
            meta["filename"] = file_name

        logger.info(f"Successfully processed {len(chunks)} chunks from {file_name}")
        return chunks, metadata

    except Exception as e:
        logger.error(f"Error during file processing: {e}")
        raise
