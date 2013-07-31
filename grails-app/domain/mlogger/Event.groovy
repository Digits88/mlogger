package mlogger

import org.bson.types.ObjectId

class Event {

    ObjectId id
    int lineNumber

    static belongsTo = [source: Source]

    static constraints = {
    }
}
