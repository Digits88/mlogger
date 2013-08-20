__author__ = 'Martin'

import re
import sys
import time
import bson
from pymongo import Connection
from pymongo.errors import ConnectionFailure
from pymongo import ASCENDING, DESCENDING
from datetime import datetime
from time import mktime

#file = open("D:\\catalina2.txt","r")
#rexp = re.compile('^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2},\d{3}) (\[.*\]) (.*) (\S*) (\(.*\)) - (.*)$')
rexp = re.compile(sys.argv[3])
file = open(sys.argv[1],"r")

# Connect to MongoDB
try:
    c = Connection(host="localhost", port=27017)
except ConnectionFailure, e:
    sys.stderr.write("Could not connect to MongoDB: %s" % e)
    sys.exit(1)
# Get a Database handle to a database named "mydb"
db = c["sample"]
# Demonstrate the db.connection property to retrieve a reference to the
# Connection object should it go out of scope. In most cases, keeping a
# reference to the Database object for the lifetime of your program should
# be sufficient.
assert db.connection == c
print "Successfully set up a database handle"
tic = time.clock()
lineNumber = 1
events = []
event = None
stackTrace = ''
earliestEvent = ''
lastEvent = ''
#mapList = ['DATE','TIME','HOST','LEVEL','CLASS','THREAD', 'MESSAGE']
#mapList = sys.argv[4]
#mapList = ['DATE', 'TIME', 'TEXT']
print sys.argv[2]
print sys.argv[3]
print sys.argv[4]

aa = sys.argv[4].strip("[]")
mapList = [x.strip() for x in aa.split(',')]
print mapList

try:
    for line in file:
        match = rexp.match(line)
        # if regex doesn't match line then add line to 'stackTrace' variable
        if match is not None:
            # if stackTrace exist then add stackTrace to previous event (last event (line) that occur before stackTrace)
            if stackTrace is not '':
                event['stackTrace'] = stackTrace
                # clean value in stackTrace (prepare variable for new stackTrace message)
                stackTrace = ''

            # id stackTrace doesn't exist then add previous event (previous line) into 'dictionary list' and create new event (current line)
            if stackTrace is '':
                if event is not None:
                    events.append(event)
                event =  {
                    '_id': bson.ObjectId(),
                    'version': 0,
                    'source_id': bson.ObjectId(sys.argv[2]),
#                    'source': sys.argv[2],
                    'lineNumber': lineNumber,
                    # Event Fields (these fields are entered by user from UI)
#                    'DATE': match.group(1),
#                    'TIME': match.group(2),
#                    'HOST': match.group(3),
#                    'LEVEL': match.group(4),
#                    'CLASS': match.group(5),
#                    'THREAD': match.group(6),
#                    'MESSAGE': match.group(7)
                }
                # add earliestEvent and lastEvent to source document
                if earliestEvent is '':
                    earliestEvent = match.group(1)
                lastEvent = match.group(1)

                # Event Fields (these fields are entered by user from UI)
                for index,field in enumerate(mapList):
                    if field == 'TIME':
                        timestamp = time.strptime(match.group(index + 1), "%Y-%m-%d %H:%M:%S,%f")
                        event[field] = datetime.fromtimestamp(mktime(timestamp))
                    else:
                        event[field] = match.group(index + 1)

            lineNumber +=  1
            if lineNumber % 1000 == 0:
                db["event"].insert(events)
                events = []
        else:
            stackTrace += line
    # make sure that last event is add into 'dictionary list' (when for loop is running it never add last event to
    # dictionary list - loop always add one line ahead so last line has to be add after loop finish as it's saved in event variable)
    if event is not None:
        # needed if stackTrace is last line in the log file
        if stackTrace is not '':
            event['stackTrace'] = stackTrace
        events.append(event)
    # insert dictionary list that didn't reach 1000 bulk inserts
    if events:
        db["event"].insert(events)

    db["source"].update({"_id": bson.ObjectId(sys.argv[2])},{"$set":{"countEvent": lineNumber, "earliestEvent": earliestEvent, "lastEvent": lastEvent}})
finally:
    file.close( )

toc = time.clock()
print("Total of logs inserted: %s" % (lineNumber - 1))
print("Total time of log insertion: %s" % (toc - tic))

print("Start creating index 'source_id: 1, lineNumber: 1'")
db["event"].create_index([("source_id", ASCENDING), ("lineNumber", ASCENDING)])
db["event"].create_index([("source_id", ASCENDING), ("lineNumber", ASCENDING), ("MESSAGE", ASCENDING)])
#db["event"].create_index([("source_id", ASCENDING), ("lineNumber", ASCENDING), ("stackTrace", ASCENDING)])
print("Total time of creating insertion: %s" % (toc - tic))

print("Total time of all processes: %s" % (toc - tic))
