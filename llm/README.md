# LLM_Local_Laptop_Search

 
### 1. Clone the Repository
 
```bash
git clone https://github.com/VaibhavYadavAntino/LLM_Local_Laptop_Search.git
cd LLM_Local_Laptop_Search
```
### 2. Set Up Virtual Environment

 
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

```
 
### 3. Install Dependencies
 

 
```env
pip install -r requirements.txt

```

 
 
### 4. Configure Environment Variables

Create a .env file and configure the required variables:
 
```bash
OPENAI_API_KEY=<Your API Key>
PINECONE_API_KEY=<Database Connection String>
PINECONE_ENV=<Your Database Environment>

```
 
### 5. Run the Application
 

```bash
uvicorn app.main:app --reload
```

 
