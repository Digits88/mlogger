package mlogger

import org.bson.types.ObjectId

class Project {

    ObjectId id
    String name
    static hasMany = [sources: Source]
//    List<Source> sources
//
//    static embedded = ['sources']
//
//    static mapWith = "mongo"

    static constraints = {
        sources reference: false
    }
}
