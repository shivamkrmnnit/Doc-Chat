import logging
 
from fastapi import FastAPI, HTTPException, Request
from services.file_handler import download_and_extract
from services.embedding import embed_text
from services.vector_store import search_embeddings,store_embeddings
import os
 
from services.llm_handler import generate_answer
 
app = FastAPI()
 
 
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
 
 
@app.post("/upload-file")
async def upload_file(request: Request):
    try:
        body = await request.json()
        user_id = body.get("user_id")
        file_url = body.get("fileUrl")
        originalName = body.get("originalName")
        # print(originalName)
        if not user_id or not file_url:
            raise ValueError("Missing 'user_id' or 'fileUrl' in request body.")
 
        
 
        # 1. Extract and validate text and metadata
        chunks, metadata = download_and_extract(file_url)
        if not chunks:
            raise ValueError("No content extracted from file.")
        if len(chunks) != len(metadata):
            raise ValueError("Mismatch between extracted chunks and metadata.")
 
        # Add filename and ensure metadata is complete
        for meta in metadata:
            meta["filename"] = originalName
 
       
 
        # 2. Generate embeddings
        embeddings = embed_text(chunks)
        if not embeddings:
            raise ValueError("Failed to generate embeddings.")
        if len(embeddings) != len(chunks):
            raise ValueError("Mismatch between chunks and embeddings.")
 
        logging.info("INFO", metadata)
        # 3. Store in vector DB with metadata
        store_embeddings(
            user_id=user_id,
            documents=chunks,
            embeddings=embeddings,
            metadata_list=metadata
        )
 
        logger.info(f"Stored {len(embeddings)} embeddings for user {user_id}")
        return {
            "message": "File processed successfully",
            "chunks": len(chunks),
            "embeddings": len(embeddings),
            "metadata" : metadata
        }
 
    except Exception as e:
        logger.exception("Upload failed.")
        raise HTTPException(status_code=500, detail=str(e))
 
 
@app.get("/health")
async def health_check():
    return {
        "status": "up",
        "message": "LLM_Local_Laptop_Search API is running fine!"
    }  
 
 
@app.post("/query-document")
async def query_document(request: Request):
    try:
        body = await request.json()
        user_id = body.get("userId")
        query = body.get("query")
       
 
        # Generate query embedding
        query_embedding = embed_text([query])[0]
        if query_embedding is None:
            raise ValueError("Failed to generate embedding from query.")
 
        logger.info(f"Query embedding generated. Dimension: {len(query_embedding)}")
 
        # Search Pinecone --> similarity search
        search_results = search_embeddings(
            user_id,
            query_embedding=query_embedding,
            top_k=5,
            min_score=0.7  
        )
 
        logger.info(f"Query embedding generated. Dimension: {search_results}")
 
 
        if not search_results:
            logger.warning("No similar documents found above score threshold.")
            return {
                "query": query,
                "context": "",
                "metadata": [],
                "answer": "No relevant information found."
            }
 
        # Prepare context & metadata
        context_chunks = []
        metadata_info = []
 
        for result in search_results:
            metadata = result.get("metadata", {})
            text = metadata.get("text", "").strip()
 
            if not text:
                logger.warning(f"Result {result.get('id', 'Unknown')} has no text.")
                continue
 
            context_chunks.append(text)
            logging.info("Info", metadata)
 
            metadata_info.append({
                "id": result.get("id", "Unknown"),
                "page_number": metadata.get("page_number", "Unknown"),
                "source": metadata.get("source", "Unknown"),
                "file_name": metadata.get("filename", "filename:21312"),
                "score": round(result.get("score", 0), 3)
            })
 
       
        if not context_chunks:
            logger.info("No valid context chunks available.")
            return {
                "query": query,
                "context": "",
                "metadata": [],
                "answer": "No relevant information found."
            }
 
        context = " ".join(context_chunks)
        logger.info(f"Context prepared. Total length: {len(context)}")
 
 
       
        # Generate answer from LLM
        answer = generate_answer(context, query)
        # print(metadata_info, "metadata")
 
        return {
            "success": 1,
            "query": query,
            "context": context,
            "metadata": metadata_info,
            "answer": answer
        }
 
    except HTTPException:
        raise  
 
    except Exception as e:
        logger.exception("Unexpected error in query_document")
        raise HTTPException(status_code=500, detail=str(e))
 
 
