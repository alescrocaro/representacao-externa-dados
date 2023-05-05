from db_connection import MongoDBClient
from pymongo.errors import PyMongoError



class Server:
    def __init__(self):
        self.connected = False
        # Create instance of MongoDBClient class
        mongo_client = MongoDBClient()

        self.db_client = mongo_client.get_client()
        try:
            # try to access a collection or run an operation to check connection
            self.db = self.client['mydatabase']
            self.collection = self.db['mycollection']
            self.collection.count_documents({})

            print("MongoDB connection established!")
            self.connected = True

        except PyMongoError as e:
            print("Connection failed:")
            print(e)

    def CreateMovie(self):
        if self.connected:
            print('creating movie...')

    def ReadMovie(self):
        if self.connected:
            print('reading movie...')

    def UpdateMovie(self):
        if self.connected:
            print('updating movie...')

    def DeleteMovie(self):
        if self.connected:
            print('deleting movie...')