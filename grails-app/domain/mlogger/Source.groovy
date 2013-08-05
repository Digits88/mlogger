package mlogger

import org.bson.types.ObjectId

class Source {

    ObjectId id
    String name
//    String host
//    String source
//    String dataType
//    Integer countEvent
//    Date earliestEvent
//    Date lastEvent

    static belongsTo = [project: Project]

    static constraints = {
    }
}
