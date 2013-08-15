package mlogger

import org.bson.types.ObjectId
import grails.converters.JSON
import groovy.json.JsonBuilder

class LogViewerController {

    public static def startTime
     def beforeInterceptor = {
         startTime = System.nanoTime()
         log.info ">>> ${actionName}"
         log.info "    uri ${actionUri}"
         params.each {param -> log.info "    ${param.key} = ${param.value}"
         }
     }

     def afterInterceptor = {
         log.info "<<< ${actionName} (${(startTime - System.nanoTime())/1000000000} seconds)"
     }
     public static final def REGEX = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2},\d{3}) (\[.*\]) (.*) (\S*) (\(.*\)) - (.*)$/
//     public static final def HEADER = [1:"DATE", 2:"TIME", 3:"THREAD", 4:"LEVEL", 5:"LOGGER", 6:"Diagnostic Context", 7:"MESSAGE"]
    public static final def HEADER = ["DATE","TIME","HOST","LEVEL","CLASS","THREAD","MESSAGE"] as LinkedList



    def index(Integer max) {
//        params.max = Math.min(max ?: 10, 100)
//        model: [projectInstanceList: Project.list(params), projectInstanceTotal: Project.count()]
        render(view: "logViewer")
    }

    def list(String sourceId, Integer maxPag, Integer offsetPag) {
        if (!maxPag || maxPag == null) maxPag = 10
        if (!offsetPag || offsetPag == null) offsetPag = 0
        if (!params.sort) params.sort = "lineNumber"
        if (!params.order) params.order = "asc"

        ObjectId objectId = new ObjectId(sourceId)
        def totalEvents = Event.collection.find(source_id: objectId).count();

        def eventList = []
        Event.collection.find(source_id: objectId).limit(maxPag).skip(offsetPag).sort(lineNumber: 1).each { log ->
            eventList << log
        }

        render(contentType: "text/json") {
            logs = eventList
            pagination = {
                total = totalEvents
                noOfPages = totalEvents/maxPag
                max = maxPag
                offset = offsetPag
            }
            time = (startTime - System.nanoTime())/1000000000
        }
    }


}
