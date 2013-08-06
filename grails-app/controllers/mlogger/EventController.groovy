package mlogger

import org.springframework.dao.DataIntegrityViolationException
import org.codehaus.groovy.grails.web.context.ServletContextHolder
import javax.servlet.http.HttpServletResponse
import grails.converters.JSON
import org.bson.types.ObjectId

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

    def search(Integer max, Integer offset, String searchText2) {
        def mongo = new GMongo()

            // Get a reference to the db
            def db = mongo.getDB("sample")
        log.info"search " + searchText2

        def results
        def resultTotal
        DBCollection coll = db.getCollection("event");

//        final DBObject textSearchCommand = new BasicDBObject();
//        textSearchCommand.put("text", coll);
//        textSearchCommand.put("search", searchText2);
        def textSearchCommand = [ "text": "event", "search": searchText2 ]

        final CommandResult commandResult = db.command(textSearchCommand);
        log.info"ss " +  commandResult.results
//        log.info"ss " +  commandResult.results.count()


        render(template: "log", model: [eventInstanceList: commandResult.results, eventFields: HEADER, eventTotal: 10, sourceInstanceId: params.id, time: (startTime - System.nanoTime())/1000000000, searchText: searchText2])

    }
}
