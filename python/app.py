import requests
import json
from requests.auth import HTTPDigestAuth
from flask_cors import CORS
from gevent.pywsgi import WSGIServer
from flask import jsonify
from flask import Flask
import os

# First Api call (get people count)
url = 'http://192.168.1.108/cgi-bin/videoStatServer.cgi?action=getSummary&channel=1'
# Second Api call (reset camera people count to 0)
url2 = 'http://192.168.1.108/cgi-bin/videoStatServer.cgi?action=getSummary&channel=1'

clearUrl = 'http://192.168.1.108/cgi-bin/videoStatServer.cgi?action=clearSectionStat&'
# Variable to fix the camera bug
# shambles = 0

app = Flask(__name__)
CORS(app)


@app.route('/')
def getDahua():
    def getData():
        Dahua = requests.get(url, auth=HTTPDigestAuth('admin', 'Lupata1488*'))

        # Turns all values to a list of lines
        DahuaValues = Dahua.text.splitlines()
        # DahuaValues = exampleData.text.splitlines()
        # DahuaValues = exampleData.splitlines()

        # Total of people entered today:
        PeopleInString = DahuaValues[4]
        PeopleIn = int(PeopleInString.split("=", 1)[1])

        # Total number of people exited today:
        PeopleOutString = DahuaValues[8]
        PeopleOut = int(PeopleOutString.split("=", 1)[1])

        # Total number of people inside right now + bug fix
        PeopleCount = PeopleIn - PeopleOut

        # print(PeopleCount)

        # Number of people still allowed to enter
        MaxPeople = 1
        AllowedToEnter = MaxPeople - PeopleCount

        # print('Allowed to Enter:', AllowedToEnter)

        # Return peopleCount, people in, people out
        res = {"PeopleIn": PeopleIn, "PeopleOut": PeopleOut,
               "PeopleCount": PeopleCount, "MaxPeople": MaxPeople}

        return res

    data = getData()
    
    if data["PeopleCount"] < 0:
        requests.get(clearUrl, auth=HTTPDigestAuth('admin', 'Lupata1488*'))
        data = jsonify(getData())
        data.status_code = 200
        return data
    
    data = jsonify(getData())
    data.status_code = 200
    return data


@app.route('/firstboot')
def fixDahua():
    requests.get(clearUrl, auth=HTTPDigestAuth('admin', 'Lupata1488*'))
    res = jsonify('success')
    res.status_code = 200
    return res


# #Fix the peoplecounting bug on first launch, call only once
# @app.route('/firstboot')
# def fixDahua():

#     global shambles

#     Dahua = requests.get(url, auth=HTTPDigestAuth('admin', 'Lupata1488*'))

#     # Turns all values to a list of lines
#     DahuaValues = Dahua.text.splitlines()
#     # DahuaValues = exampleData.text.splitlines()
#     # DahuaValues = exampleData.splitlines()

#     # Total of people entered today:
#     PeopleInString = DahuaValues[4]
#     PeopleIn = int(PeopleInString.split("=", 1)[1])

#     # Total number of people exited today:
#     PeopleOutString = DahuaValues[8]
#     PeopleOut = int(PeopleOutString.split("=", 1)[1])

#     # Total number of people inside right now + bug fix
#     PeopleCount = PeopleIn - PeopleOut

#     #Fix people counting bug
#     if PeopleCount < 0:

#         shambles = -PeopleCount
#     res = jsonify('success')
#     res.status_code = 200
#     return res


# if __name__ == "__main__":
#     http_server = WSGIServer(('', 5000), app)
#     http_server.serve_forever()
