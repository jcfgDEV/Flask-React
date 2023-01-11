from flask import Flask, request,Response,jsonify
from pymongo import MongoClient
from bson import json_util,ObjectId


from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
client = MongoClient('mongodb+srv://ObscureBM:WfhEnDVw90w8FVSU@cluster0.imwio.mongodb.net/?retryWrites=true&w=majority')
db = client.test


@app.route('/userAdd', methods=['POST'])
def userPost():
    #sending data for the mongodb
    nombre = request.json['Nombre']
    asunto = request.json['Asunto']
    email = request.json['Email']
    password = request.json['Password']
    
    if nombre and asunto and email and password:
       hashed_password = generate_password_hash(password)
       _id = db.Aizen.insert_one(
        {'nombre': nombre, 'asunto': asunto, 'email':email, 'password': hashed_password}
       )
       response = jsonify({"Message": "User with ID: " + str(_id.inserted_id) + "" " was Created Sucessfull"})
       return response
    else:
        {'message':'Error cannot be send'}

@app.route('/usersGet', methods=['GET'])
def userGet():
    #Geeting data
    users = db.Aizen.find({})
    response = json_util.dumps(users)
    return Response(response, mimetype='application/json')

@app.route('/userFind/<id>', methods=['GET'])
def userFind(id):
    FindOne = db.Aizen.find_one({"_id": ObjectId(id)})
    response= json_util.dumps(FindOne)
    return Response(response, mimetype='application/json')

@app.route('/usersDelete/<id>', methods=['DELETE'])
def userDelete(id):
    db.Aizen.delete_one({"_id": ObjectId(id)})
    response = jsonify({"Message": "User with ID: " + id + "" " was Deleted Sucessfull"})
    return response

if __name__ == "__main__":
    app.run(debug=True)