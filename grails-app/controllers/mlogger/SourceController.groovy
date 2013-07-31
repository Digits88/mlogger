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

    def list(String id) {
        def projectInstance = Project.get(new ObjectId(id))
        if (!projectInstance) {
            log.error message(code: 'default.not.found.message', args: [message(code: 'project.label', default: 'Project'), id])
            response.setStatus HttpServletResponse.SC_NOT_FOUND
            render (["message": message(code: 'default.not.found.message', args: [message(code: 'project.label', default: 'Project'), id])] as JSON)
            return
        }
        render Source.findAllByProject(projectInstance) as JSON
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

    def save() {
        ObjectId objectId = new ObjectId(params.projectId)
        Project projectInstance = Project.get(objectId)
        if (!projectInstance) {
            response.setStatus HttpServletResponse.SC_NOT_FOUND
            render text: message(code: 'default.not.found.message', args: [message(code: 'project.label', default: 'Project'), params.projectId])
        }
        log.info"projectInstance " + projectInstance.name


        def sourceInstance = new Source(name: params.name, host: params.host.host)
//        if (!sourceInstance.save(flush: true, failOnError: true)) {
//            response.sendError HttpServletResponse.SC_INTERNAL_SERVER_ERROR
//            render text: 'Failed to do create project.'
//        }
        log.info"sourceInstance " +sourceInstance

        projectInstance.addToSources(sourceInstance)
        if (!projectInstance.save(flush: true, failOnError: true)) {
            response.sendError HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            render text: 'Failed to do create project.'
        }

        projectInstance.sources.each { project ->
            log.info"project " + project.name
        }

        response.setStatus HttpServletResponse.SC_CREATED
        render text: message(code: 'default.created.message', args: [message(code: 'project.label', default: 'Project'), sourceInstance.id])
    }

    def show(Long id) {
        def sourceInstance = Source.get(id)
        if (!sourceInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'source.label', default: 'Source'), id])
            redirect(action: "list")
            return
        }

        [sourceInstance: sourceInstance]
    }

    def edit(Long id) {
        def sourceInstance = Source.get(id)
        if (!sourceInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'source.label', default: 'Source'), id])
            redirect(action: "list")
            return
        }

        [sourceInstance: sourceInstance]
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

    def delete(Long id) {
        def sourceInstance = Source.get(id)
        if (!sourceInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'source.label', default: 'Source'), id])
            redirect(action: "list")
            return
        }

        try {
            sourceInstance.delete(flush: true)
            flash.message = message(code: 'default.deleted.message', args: [message(code: 'source.label', default: 'Source'), id])
            redirect(action: "list")
        }
        catch (DataIntegrityViolationException e) {
            flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'source.label', default: 'Source'), id])
            redirect(action: "show", id: id)
        }
    }
}
