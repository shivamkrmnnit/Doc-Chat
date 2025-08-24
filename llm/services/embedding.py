import os
import numpy as np  
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings


# Load environment variables
load_dotenv()

def embed_text(chunks: list) -> list:
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OpenAI API key is not set. Please add it to the .env file.")
  # Initialize the embedder
    embedder = OpenAIEmbeddings(openai_api_key=openai_api_key)
    
    # Generate embeddings
    embeddings = []
    for chunk in chunks:
        try:
            embedding = embedder.embed_query(chunk)
            embedding_array = np.array(embedding, dtype=np.float32)
            embeddings.append(embedding_array)
        except Exception as e:
            print(f"Error embedding chunk: {chunk}\n{e}")
            continue

    # Validate embeddings
    if not embeddings:
        raise ValueError("No embeddings were generated. Please check your input and API settings.")
    
    return embeddings