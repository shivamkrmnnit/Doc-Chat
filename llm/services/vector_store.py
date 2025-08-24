import os
import numpy as np
from pinecone import Pinecone, ServerlessSpec

# Initialize Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Ensure the index exists or create it
index_name = "rag-index"

# Access the index
index = pc.Index(index_name)

# Function to store embeddings
def store_embeddings(user_id, documents, embeddings, metadata_list):
    if not documents or not embeddings or len(documents) != len(embeddings):
        raise ValueError("Mismatch or empty documents/embeddings")

    data = []
    for i, embedding in enumerate(embeddings):
        metadata = metadata_list[i]
        metadata["text"] = documents[i]
        metadata["user_id"] = user_id

        data.append({
            "id": f"{user_id}_doc_{i}",
            "values": np.array(embedding, dtype=np.float32).tolist(),
            "metadata": metadata
        })

    index.upsert(vectors=data)


def search_embeddings(user_id, query_embedding, top_k=5, min_score=0.85):
    query_embedding = np.asarray(query_embedding, dtype=np.float32)
    query_embedding = query_embedding / np.linalg.norm(query_embedding)
    query_embedding_list = query_embedding.tolist()

    result = index.query(
        vector=query_embedding_list,
        top_k=top_k,
        include_metadata=True,
        filter={"user_id": {"$eq": user_id}}
    )

    matches = []
    for match in result.get("matches", []):
        if match.get("score", 0) >= min_score:
            matches.append({
                "id": match.get("id"),
                "score": match.get("score"),
                "metadata": match.get("metadata", {})
            })

    return matches

