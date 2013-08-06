package mlogger

import org.bson.types.ObjectId

class Event {

    ObjectId id
    Long lineNumber
    static hasMany = [events: Event]
    static belongsTo = [source: Source]

    static constraints = {
        events reference: false
    }
}
