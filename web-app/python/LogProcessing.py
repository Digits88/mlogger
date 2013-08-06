__author__ = 'Martin'

import re
import mysql.connector
import time
import uuid
import sys

file = open(sys.argv[1],"r")
#file = open("D:\\catalina.out","r")
#rexp = re.compile('^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}) (.*)$')
rexp = re.compile(sys.argv[3])
rexp2 = re.compile('^(.*)$')

conn = mysql.connector.connect(user='root',host='localhost',database='log_test')
cursor = conn.cursor()
tic = time.clock()
lineNumber = 0
version = 0
large_text = ""
id = ""
sqlLog = 'insert into logt(id,version,line_number,date,message,source_id) values (%s,%s,%s,%s,%s,%s)'
sqlLargeMessage = 'insert into large_message(id,version,large_message, log_id) values (%s,%s,%s,%s)'
args = []
argsLargeMessage = []
sourceId = sys.argv[2]
try:
    for line in file:
        match = rexp.match(line)
        match2 = rexp2.match(line)
        if match is not None:
            if large_text is not "" and id is not "":
                argsLargeMessage.append([id] + [version] + [large_text]+[id])
                large_text = ""
            if large_text is "":
                lineNumber +=  1
                id = str(uuid.uuid1())
                args.append([id] + [version] + [lineNumber] + ["null"] + list(match2.groups()) + [sourceId])
            if lineNumber % 1000 == 0:
                cursor.executemany(sqlLog, args)
                cursor.executemany(sqlLargeMessage, argsLargeMessage)
                args = []
                argsLargeMessage = []
        else:
            large_text += line
    if args:
        cursor.executemany(sqlLog, args)
        if large_text is not "":
            argsLargeMessage.append([id] + [version] + [large_text]+[id])
            cursor.executemany(sqlLargeMessage, argsLargeMessage)
    cursor.execute("UPDATE source SET count_event=%s WHERE id=%s", (lineNumber, sourceId))
finally:
    file.close( )
conn.commit()
cursor.close()
conn.close()

toc = time.clock()
print("Total time: %s" % (toc - tic))