"""
    Make connection with database through information provided by .env
    Author: Alexandre Aparecido Scrocaro Junior, Pedro Klayn
    Dates: 
        start: 02/05/2023
        more info: https://github.com/alescrocaro/representacao-externa-dados
"""

import os

from pymongo import MongoClient
from dotenv import load_dotenv
from urllib.parse import quote_plus # used to escape string

load_dotenv()
DB_USER = quote_plus(os.getenv('DB_USER'))
DB_PASSWORD = quote_plus(os.getenv('DB_PASSWORD'))

class MongoDBClient:
    def __init__(self):
        uri = f"mongodb+srv://{DB_USER}:{DB_PASSWORD}@cluster0.8412ycf.mongodb.net/?retryWrites=true&w=majority"
        self.client = MongoClient(uri)

    def get_client(self):
        return self.client
