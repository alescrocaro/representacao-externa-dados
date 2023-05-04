from db_connection import MongoDBClient
from pymongo.errors import PyMongoError


# Create instance of MongoDBClient class
mongo_client = MongoDBClient()

client = mongo_client.get_client()

connected = False

try:
    # try to access a collection or run an operation to check connection
    db = client['mydatabase']
    collection = db['mycollection']
    collection.count_documents({})

    print("MongoDB connection established!")
    connected = True

except PyMongoError as e:
    print("Connection failed:")
    print(e)

