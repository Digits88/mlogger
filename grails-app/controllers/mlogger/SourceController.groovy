package mlogger

import org.springframework.dao.DataIntegrityViolationException
import org.springframework.web.multipart.MultipartFile
import grails.converters.JSON
import org.codehaus.groovy.grails.web.context.ServletContextHolder
import javax.servlet.http.HttpServletResponse
import org.bson.types.ObjectId

class SourceController {

    FileService fileService

    def beforeInterceptor = {
//        startTime = System.nanoTime()
        log.info ">>> ${actionName}"
        log.info "    uri ${actionUri}"
        params.each {param -> log.info "    ${param.key} = ${param.value}"
        }
    }

    def afterInterceptor = {
        log.info "<<< ${actionName}"
    }

    def index() {
        redirect(action: "list", params: params)
    }

//    def list(Integer max) {
//        params.max = Math.min(max ?: 10, 100)
////        render ([sourceInstanceList: Source.list(params), sourceInstanceTotal: Source.count()] as JSON)
//        render ([sourceInstanceList: Source.findByProject(params), sourceInstanceTotal: Source.count()] as JSON)
//    }

    def list(String projectId) {
        def projectInstance = Project.get(new ObjectId(projectId))
        if (!projectInstance) {
            log.error message(code: 'default.not.found.message', args: [message(code: 'project.label', default: 'Project'), projectId])
            response.setStatus HttpServletResponse.SC_NOT_FOUND
            render (["message": message(code: 'default.not.found.message', args: [message(code: 'project.label', default: 'Project'), projectId])] as JSON)
            return
        }
//        render Source.findAllByProject(projectInstance) as JSON

        def projectJsonList = []
        Source.collection.find(project: new ObjectId(projectId)).each { log ->
            projectJsonList << log
        }
        render contentType: "application/json", text: projectJsonList
    }

    def preview() {
        def file = request.getFile('file')
        log.info "file " + file
        log.info "fileName " + file.getOriginalFilename()
        log.info "params " + params


        def previewLogsList = []
        def uploadedFile = null
        if(!file.empty) {
            uploadedFile = fileService.uploadFile(file,"test.txt","log_files")
        }
        if(uploadedFile) {
            try {
                new File("${uploadedFile}").eachLine() { line, lineNumber ->
                    previewLogsList.add(line)
                    if (lineNumber == 5)
                        throw new Exception("return from closure")
            }
            } catch (Exception e) { }
        }
        session.putValue("filePath", uploadedFile)
        def converter = new JSON(logs: previewLogsList, fileSize: file.getSize(), fileName: file.getOriginalFilename());

        render contentType: 'application/json', text: converter
    }

//    def save() {
//        ObjectId objectId = new ObjectId(params.projectId)
//        def projectInstance = Project.get(objectId)
//        if (!projectInstance) {
//            response.setStatus HttpServletResponse.SC_NOT_FOUND
//            render text: message(code: 'default.not.found.message', args: [message(code: 'project.label', default: 'Project'), params.projectId])
//        }
//        log.info "User agent: " + request.JSON
//        def head
//        def regex
//        request.JSON.each { k,v ->
//            if(k == "mask") {
//                log.info "key: " + v.head
//                head = v.head
//                regex = v.regex
//            }
//        }
//        log.info "User agent: " + regex
//
//        ObjectId cc = new ObjectId()
//
//        def sourceInstance = new Source(id: new ObjectId("4f2ca36b25f39d121957cebb"), name: params.name, host: params.host.host, mask: [head: head, regex: regex], version: 0)
//
//        projectInstance.sources.add(sourceInstance)
////        Project.collection.update([_id: objectId],[$set: [$push: [sources: [name: params.name, host: params.host.host]]]], true)
//
////        UserHistory test2 = new UserHistory(info:"example2");
////        User user = new User (username:"test", emailAddress:"test@example.com", userHistory :[test, test2])
////
////        def sourceInstance = new Source(params)
//        if (!projectInstance.save(flush: true)) {
//            response.sendError HttpServletResponse.SC_INTERNAL_SERVER_ERROR
//            render text: 'Failed to do create source.'
//        }
//
//        response.setStatus HttpServletResponse.SC_CREATED
//        render text: message(code: 'default.created.message', args: [message(code: 'source.label', default: 'Project'), sourceInstance.id])
//    }

    def save(String projectId) {
//        if (!request.JSON) {
//            log.error "Not Acceptable error when parsing JSON"
//            // TODO: create some wrapper for this as this should be in every save and update method
//            response.sendError HttpServletResponse.SC_NOT_ACCEPTABLE
//            render (["message": "Not Acceptable error when parsing JSON"] as JSON)
//            return
//        }

        def projectInstance = Project.get(new ObjectId(projectId))
        if (!projectInstance) {
            log.error message(code: 'default.not.found.message', args: [message(code: 'project.label', default: 'Project'), projectId])
            response.setStatus HttpServletResponse.SC_NOT_FOUND
            render (["message": message(code: 'default.not.found.message', args: [message(code: 'project.label', default: 'Project'), projectId])] as JSON)
            return
        }

        def sourceInstance = new Source(name: params.name, host: params.host.host)

        log.info"sourceInstance " +sourceInstance

        projectInstance.addToSources(sourceInstance)
        if (!sourceInstance.save(flush: true)) {
            log.error projectInstance.errors
            response.sendError HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            render (["message": projectInstance.errors] as JSON)
            return
        }

        projectInstance.sources.each { project ->
            log.info"project " + project.name
        }

        log.info message(code: 'default.created.message', args: [message(code: 'source.label', default: 'Source'), sourceInstance.id])
        response.setStatus HttpServletResponse.SC_CREATED
        render (["message": message(code: 'default.created.message', args: [message(code: 'source.label', default: 'Source'), sourceInstance.id]), "sourceId": sourceInstance.id.toString()] as JSON)
    }

    def edit(String id) {
//        def sourceInstance = Source.get(id)
        def sourceInstance = Source.collection.findOne(_id: new ObjectId(id))
        if (!sourceInstance) {
            log.error message(code: 'default.not.found.message', args: [message(code: 'source.label', default: 'Source'), id])
            response.setStatus HttpServletResponse.SC_NOT_FOUND
            render (["message": message(code: 'default.not.found.message', args: [message(code: 'source.label', default: 'Source'), id])] as JSON)
            return
        }

        //        [sourceInstance: sourceInstance]
        render contentType: "application/json", text: sourceInstance
    }

    def update(Long id, Long version) {
        def sourceInstance = Source.get(id)
        if (!sourceInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'source.label', default: 'Source'), id])
            redirect(action: "list")
            return
        }

        if (version != null) {
            if (sourceInstance.version > version) {
                sourceInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                          [message(code: 'source.label', default: 'Source')] as Object[],
                          "Another user has updated this Source while you were editing")
                render(view: "edit", model: [sourceInstance: sourceInstance])
                return
            }
        }

        sourceInstance.properties = params

        if (!sourceInstance.save(flush: true)) {
            render(view: "edit", model: [sourceInstance: sourceInstance])
            return
        }

        flash.message = message(code: 'default.updated.message', args: [message(code: 'source.label', default: 'Source'), sourceInstance.id])
        redirect(action: "show", id: sourceInstance.id)
    }

    def delete(String id) {
        def sourceInstance = Source.get(new ObjectId(id))
        if (!sourceInstance) {
            log.error message(code: 'default.not.found.message', args: [message(code: 'source.label', default: 'Source'), id])
            response.setStatus HttpServletResponse.SC_NOT_FOUND
            render (["message": message(code: 'default.not.found.message', args: [message(code: 'source.label', default: 'Source'), id])] as JSON)
            return
        }

        try {
            sourceInstance.delete(flush: true)
            log.info message(code: 'default.deleted.message', args: [message(code: 'source.label', default: 'Source'), id])
            response.setStatus HttpServletResponse.SC_OK
            render (["message": message(code: 'default.deleted.message', args: [message(code: 'source.label', default: 'Source'), id])] as JSON)
        }
        catch (DataIntegrityViolationException e) {
            log.warn message(code: 'default.not.deleted.message', args: [message(code: 'source.label', default: 'Source'), id])
            response.setStatus HttpServletResponse.SC_CONFLICT
            render (["message": message(code: 'default.not.deleted.message', args: [message(code: 'source.label', default: 'Source'), id])] as JSON)
        }
    }
}
