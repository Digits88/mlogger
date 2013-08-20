package mlogger

import org.springframework.dao.DataIntegrityViolationException
import org.codehaus.groovy.grails.web.context.ServletContextHolder
import javax.servlet.http.HttpServletResponse
import grails.converters.JSON
import org.bson.types.ObjectId
import com.mongodb.DBCollection
import com.mongodb.CommandResult
import com.gmongo.GMongo
import java.text.*;
import org.joda.time.format.*

class EventController {

    FileService fileService
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

    def saveTest(String sourceId) {
        def sourceInstance = Source.get(new ObjectId(sourceId))
        if (!sourceInstance) {
            log.error message(code: 'default.not.found.message', args: [message(code: 'source.label', default: 'Source'), sourceId])
            response.setStatus HttpServletResponse.SC_NOT_FOUND
            render (["message": message(code: 'default.not.found.message', args: [message(code: 'source.label', default: 'Source'), sourceId])] as JSON)
            return
        }

        def uploadedFile = session.getAttribute("filePath")
        if (!uploadedFile) {
            log.error message(code: 'default.not.found.message', args: [message(code: 'source.labell', default: 'Upload File'), sourceId])
            response.setStatus HttpServletResponse.SC_NOT_FOUND
            render (["message": message(code: 'default.not.found.message', args: [message(code: 'source.labell', default: 'Upload File'), sourceId])] as JSON)
            return
        }

        def servletContext = ServletContextHolder.servletContext
        def pythonPath = servletContext.getRealPath("/python/insertData.py")
        def storagePathDirectory = new File(pythonPath)
        if(storagePathDirectory.exists()) {
            log.info"***************** Start Python Script *****************"
            log.info" dd " + params.head
            Process process = ["C:\\tools\\Python\\python.exe", pythonPath, uploadedFile, sourceInstance.id, params.mask.regex, params.head].execute()

            def (output, error) = new StringWriter().with { o -> // For the output
                new StringWriter().with { e ->                     // For the error stream
                    process.waitForProcessOutput( o, e )
                    [ o, e ]*.toString()                             // Return them both
                }
            }

            if (process.exitValue())  {
                log.error"Processing log FAILED"
                log.error "${error}"
                flash.error = "Error "
            } else {
                log.info"Processing log SUCCESS"
                log.info "${output}"
                session.removeAttribute("filePath")
            }
            log.info"***************** End Python Script *****************"

        } else {
            log.error"PYTHON DIRECTORY ${storagePathDirectory} is missing"
        }

        Source.collection.update([_id: sourceInstance.id],[$set: [mask: [regex: params.mask.regex, head: params.head]]])

        session.removeAttribute("filePath")
        render (["message": "Events uploaded successfully"] as JSON)
    }

    def search(String sourceId, Integer maxPag, Integer offsetPag, String searchText) {
        log.info"aa " + searchText
        if (!maxPag || maxPag == null) maxPag = 10
        if (!offsetPag || offsetPag == null) offsetPag = 0
        if (!params.sort) params.sort = "lineNumber"
        if (!params.order) params.order = "asc"

//        def mongo = new GMongo()
//
//            // Get a reference to the db
//            def db = mongo.getDB("sample")
//        def textSearchCommand = [ "text": "event", "search": searchText ]

        // http://forum.springsource.org/showthread.php?138187-mongo-text-search-support
//        final CommandResult commandResult = db.command(textSearchCommand);
//        log.info"ss " +  commandResult.results

        def regex = /${searchText}/
        ObjectId objectId = new ObjectId(sourceId)
        def totalEvents = Event.collection.find(source_id: objectId, MESSAGE:[$regex: regex]).count();

//        def to = Event.collection.find(source_id: objectId, MESSAGE:[$regex: regex]).count()
//        log.info"ss " +  to

        def eventList = []
//        Event.collection.find(source_id: objectId).limit(maxPag).skip(offsetPag).sort(lineNumber: 1).each { log ->
//            eventList << log
//        }

        Event.collection.find(source_id: objectId, MESSAGE:[$regex: regex]).limit(maxPag).skip(offsetPag).sort(lineNumber: 1).each { log ->
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

    def filter(String sourceId, Integer maxPag, Integer offsetPag, String level) {
        if (!maxPag || maxPag == null) maxPag = 10
        if (!offsetPag || offsetPag == null) offsetPag = 0
        if (!params.sort) params.sort = "lineNumber"
        if (!params.order) params.order = "asc"

//        def mongo = new GMongo()
//
//            // Get a reference to the db
//            def db = mongo.getDB("sample")
//        def textSearchCommand = [ "text": "event", "search": searchText ]
//
//        // http://forum.springsource.org/showthread.php?138187-mongo-text-search-support
//        final CommandResult commandResult = db.command(textSearchCommand);
//        log.info"ss " +  commandResult.results.getDocuments()
//        def input = params.dateFrom
//        def fmt_in = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
//        def fmt_out = ISODateTimeFormat.dateTime()
//        println fmt_out.print(fmt_in.parseDateTime(input))

//        def input = params.dateFrom
//        def fmt_in = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
//        def fmt_out = ISODateTimeFormat.dateTime()
//        def dateFrom = fmt_in.parseDateTime(input)
//        println fmt_out.print(fmt_in.parseDateTime(input))

        DateTimeFormatter parser2 = ISODateTimeFormat.dateTime();
        String jtdate = "2010-01-01T12:00:00+01:00";
        org.joda.time.DateTime dateFrom = parser2.parseDateTime(params.dateFrom)
        System.out.println(parser2.parseDateTime(params.dateFrom));

//        TimeZone tz = TimeZone.getTimeZone("UTC");
//        DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
//        df.setTimeZone(tz);
//        String nowAsISO = df.parse(params.dateFrom);
//        log.info "nowAsISO " + nowAsISO
//        log.info"params.dateFrom " + params.dateFrom
//        def dt = Date.parse("yyyy-MM-dd'T'HH:mm:ss", params.dateFrom)
//        log.info "date " + dt
//        log.info "current date " + new Date()
//        log.info "current date " + new Date() -5
        ObjectId objectId = new ObjectId(sourceId)
        def totalEvents = Event.collection.find(source_id: objectId, LEVEL: params.level).count();
        def eventList = []
        Event.collection.find(source_id: objectId, [$gte: dateFrom]).limit(maxPag).skip(offsetPag).sort(lineNumber: 1).each { log ->
            eventList << log
        }
        log.info("aaa " + eventList)
        Event.collection.find(source_id: objectId, LEVEL: params.level).limit(maxPag).skip(offsetPag).sort(lineNumber: 1).each { log ->
            eventList << log
        }
//        log.info"collection " + eventList
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

    def list(String sourceId, Integer maxPag, Integer offsetPag) {
        if (!maxPag || maxPag == null) maxPag = 10
        if (!offsetPag || offsetPag == null) offsetPag = 0
        if (!params.sort) params.sort = "lineNumber"
        if (!params.order) params.order = "asc"

        ObjectId objectId = new ObjectId(sourceId)
        def eventList = []
        def totalEvents
        if (params.searchText && params.searchText != "") {
            def regex = /${params.searchText}/
            totalEvents = Event.collection.find(source_id: objectId, MESSAGE:[$regex: regex]).count();
            Event.collection.find(source_id: objectId, MESSAGE:[$regex: regex]).limit(maxPag).skip(offsetPag).sort(lineNumber: 1).each { log ->
                eventList << log
            }
        } else {
            totalEvents = Event.collection.find(source_id: objectId).count();
            Event.collection.find(source_id: objectId).limit(maxPag).skip(offsetPag).sort(lineNumber: 1).each { log ->
                eventList << log
            }
        }

        render(contentType: "text/json") {
            logs = eventList
            pagination = {
                total = totalEvents
                noOfPages = totalEvents/maxPag
                max = maxPag
                offset = offsetPag
            }
            searchText = params.searchText
            time = (startTime - System.nanoTime())/1000000000
        }
    }
}
