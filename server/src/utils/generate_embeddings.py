from sentence_transformers import SentenceTransformer
import sys
import json
import warnings

# Suppress the specific FutureWarning from transformers
warnings.filterwarnings("ignore", category=FutureWarning, module="transformers.tokenization_utils_base")

def generate_embeddings(text):
    model = SentenceTransformer('all-MiniLM-L6-v2') 
    embedding = model.encode(text).tolist()
    return embedding

if __name__ == "__main__":
    text = sys.argv[1]
    embeddings = generate_embeddings(text)
    print(json.dumps(embeddings))
