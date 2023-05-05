import os

from pymongo import MongoClient
from dotenv import load_dotenv
from urllib.parse import quote_plus # used to escape string

load_dotenv()
DB_USER = quote_plus(os.getenv('DB_USER'))
DB_PASSWORD = quote_plus(os.getenv('DB_PASSWORD'))

class MongoDBClient:
    def __init__(self):
        uri = f"mongodb+srv://{DB_USER}:{DB_PASSWORD}a@cluster0.8412ycf.mongodb.net/?retryWrites=true&w=majority"
        self.client = MongoClient(uri)

    def get_client(self):
        return self.client
