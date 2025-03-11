###################################################################################TODO#########################################################################

#                                                       this is the communicator between the IA api and my python server


# Make all suffixed ".mp3" be dynamic for all audio types

# My s3 credentials are not secure whatsoever. 

# downloader() sometimes cannot choose from an empty sequence. Causes program to crash. Create conditional for if output length is less than whatever it is that causes the crash.
# if output.length == 0
# check if my conditional fixes problem

# find a way to store the searcher() return temporarily so it doesn't have to keep re-computing... takes a lot of time.

###################################################################################TODO#########################################################################



from flask import Flask, request, jsonify
from flask_cors import CORS
from internetarchive import download, search_items

from dotenv import load_dotenv

import random
import contextlib
import io
import os

# # Socket for TCP (WINDOWS)
import socket

# Socket (LINUX)
import asyncio
import websockets

# # audio file processing
import requests

# AWS
import boto3





app = Flask(__name__)
CORS(app)


# commented out for testing...
@app.route('/start', methods=['POST'])
def start_function():
    data = request.json # Get JSON data from the frontend
    message = data.get("message", "No message received")
    response = {"response": f"Backend received: {message}"}
    # WEBSOCKETS (WINDOWS)
    # start_server()
    print("suck it")
    return jsonify(response)

load_dotenv()


results = []
indexer = 0
random_number = []
random_song = []
thisisit = None

mylist = []
anotherlist = []
output = None
url = None
NAME_FOR_S3 = "fetch-test.mp3"
condition = False


HOST = "127.0.0.1" # Localhost
PORT = 5000

# Function to execute when receiving a specific command
def my_function():
    print("TRIGGERED!!!")

# handler for Websocket (LINUX)
async def handler(websocket):
    print("Client connected")
    async for message in websocket:
        if message == "run_function":
            print(f"Received from C++ client: {message}")
            await websocket.send(f"Echo: {message}")
            searcher()
            downloader()
            main()
            await websocket.send("source_upload")
        elif message == "finish_now":
            print("Connection has been asked to close.")
            # write logic to close connection here




# Function for Websocket (WINDOWS)
# def start_server():
#     message = f"audio_now_uploaded:{NAME_FOR_S3}"

#     searcher()

#     server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#     server_socket.bind((HOST, PORT))
#     server_socket.listen(1)

#     print("Waiting for C++ client to connect...")

#     while True:
#         conn, addr = server_socket.accept()
#         print(f"Connected to {addr}")
#         data = conn.recv(1024).decode("utf-8") # Receive and decode message
#         if not data:
#             print("not data")
#             break

#         print(f"Received from C++ {data}")

#         # Call function if message matches
#         if data.strip() == "run_function":
#             global indexer
#             random_number.append(random.randint(0, indexer))
#             print(f"random number: {random_number}")
#             print(f"Indexer {indexer}")
#             downloader()
#             main()

#             conn.sendall(message.encode('utf-8'))
#         elif data.strip() == "finish_now":
#             print("Connection closed")
#             conn.close()
#             break
            

# This gets a random song and stores the urls in the output variable
def downloader():
    with io.StringIO() as buffer, contextlib.redirect_stdout(buffer):
        download(identifier=f"{results[random.randint(0, indexer)]}", glob_pattern="*mp3", dry_run=True)
        output = buffer.getvalue()

# This is useful to display just the song name itself.
# make sure to split the full urls. We need the full url because we learned how to play audio using just the url.
    # newerstuff = output.replace("\nhttps:", "")
    # abc = newerstuff.replace("archive.org/download", "")
    # cba = abc.replace("https:///", "")
    # cada = cba.split("///")
    # for val in cada:
    #     indexing = val.index("/")
    #     newstring = val[indexing + 1:]
    #     anotherlist.append(newstring)
    # thiswork = len(anotherlist) - 1
    # random_song.append(random.randint(0, thiswork))
    # thisisit = anotherlist[random_song[0]]
    # print(thisisit)

    # Logic for getting a random single song if multiple are returned
    # need to add availability for other file types, but so far mp3 has been every single one
    if len(output) == 0:
        print("PROTOTYPE: Empty url. Starting server")
        # start_server() // no server to start on linux... do something else
    else:
        print (f"Output: {output}")
        print (f"Output length: {len(output)}")
        splitOutput = output.split(".mp3")
        print(splitOutput)
        splitOutput2 = splitOutput[:-1]
        print(splitOutput2)

        randomSong = random.choice(splitOutput2)
        print(randomSong)
        randomSongUrl = randomSong + ".mp3"
        # The randomly chosen song url
        print(randomSongUrl)
        if randomSongUrl.startswith("\n"):
            global url
            url = randomSongUrl[1:]
            return url
        else:
            url = randomSongUrl
            return url

# This download a random song to your computer... not really necessary
# def mp3Downloader(path, filename):
#     download( f"{results[random_number[0]]}", files=filename, glob_pattern="*mp3", destdir=f"{path}")

# This finds a random number based on the amount of songs in an audio collection on Internet Archive
def searcher():
    searched = search_items(query="collection:(freemusicarchive)")
    # if len(results) == 0: # why???
    for result in searched:
        results.append(result['identifier'])
    global indexer 
    indexer = len(results) - 1
    print(f"deep indexer {indexer}")
    # random_number.append(random.randint(0, indexer))
    # print(random_number)
    print("done searching")
    # return random_number
    
# Creates a random number used for finding a random song
# searcher()

# Stores the urls of the random song in "url"
# downloader()

# I believe this is how I receive a directory from the front end... I don't think I can download stuff to a users specified directory... so this might be dumb.
@app.route('/api/endpoint', methods=['POST'])
def receive_data():
    data = request.get_json() 
    downloader(data['gDirectory'])
    # mp3Downloader(data['gDirectory'], thisisit)
    return jsonify({'message': 'Data received successfully!'})

print(url)

# AWS credentials
AWS_S3_BUCKET_NAME = "firstdemoby"
AWS_REGION = "us-east-2"
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")


def main():

# FETCHED_URL = downloader
    FETCHED_DATA = requests.get(url)
    NAME_FOR_S3 = "fetch-test.mp3"

    print('in main method')

    s3_client = boto3.client(
        service_name = 's3',
        region_name = AWS_REGION,
        aws_access_key_id = AWS_ACCESS_KEY,
        aws_secret_access_key = AWS_SECRET_KEY
    )

    response = s3_client.upload_fileobj(io.BytesIO(FETCHED_DATA.content), AWS_S3_BUCKET_NAME, NAME_FOR_S3)

    print(f'upload_log_to_aws response: {response}')
    
    global condition
    condition = True


async def server():
    global condition
    condition = False
    server = await websockets.serve(handler, "localhost", 9000)  # WebSocket server
    print("WebSocket Server listening on ws://localhost:9000")
    await server.wait_closed()

asyncio.run(server())

# if __name__ == '__main__':
    # app.run(debug=True, port=4000) # DON'T USE RUN IN A PRODUCTION SETTING
    # start_server()
    # server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # server_socket.bind((HOST, PORT))
    # server_socket.listen(1)

    # print("Waiting for C++ client to connect...")

    # while True:
    #     conn, addr = server_socket.accept()
    #     print(f"Connected to {addr}")
    #     data = conn.recv(1024).decode("utf-8") # Receive and decode message
    #     if not data:
    #         print("not data")
    #         break

    #     print(f"Received from C++ {data}")

