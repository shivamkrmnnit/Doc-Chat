from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_answer(context: str, query: str) -> str:
    prompt = f"""You are an intelligent assistant. Use the context below to answer the user's question as accurately as possible.

    - If the context fully or partially (around 50-60%) matches the question, use it to generate a detailed and accurate answer.
    - If the context does not provide enough information, use your general knowledge to respond helpfully.
    - If the answer cannot be found from context or general knowledge, politely inform the user that the answer is not available in the current material.


Context:
{context}

Question:
{query}

Answer:"""

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        return response.choices[0].message.content
    except Exception as e:
        raise ValueError(f"LLM failed to respond: {str(e)}")
