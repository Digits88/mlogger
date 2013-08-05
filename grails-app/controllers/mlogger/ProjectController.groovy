package mlogger

import org.springframework.dao.DataIntegrityViolationException
import grails.converters.JSON
import javax.servlet.http.HttpServletResponse
import org.bson.types.ObjectId

class ProjectController {

    def beforeInterceptor = {
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

    def list(Integer max) {
//        params.max = Math.min(max ?: 10, 100)
//        [projectInstanceList: Project.list(params), projectInstanceTotal: Project.count()]

//        def pageInstance = Project.collection.find()
//        def items = []
//        try {
//            while (pageInstance.hasNext()) {
//                items << com.mongodb.util.JSON.serialize(pageInstance.next())
//            }
//        } finally {
//            pageInstance.close()
//        }
//        render contentType: 'application/json', text: items

        def projectJsonList = []
        Project.collection.find().each { log ->
            projectJsonList << log
        }
        render contentType: "application/json", text: projectJsonList
    }

    def save() {
        if (!request.JSON) {
            log.error "Not Acceptable error when parsing JSON"
            // TODO: create some wrapper for this as this should be in every save and update method
            response.sendError HttpServletResponse.SC_NOT_ACCEPTABLE
            render (["message": "Not Acceptable error when parsing JSON"] as JSON)
            return
        }

        def projectInstance = new Project(params)
        if (!projectInstance.save(flush: true)) {
            log.error projectInstance.errors
            response.sendError HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            render (["message": projectInstance.errors] as JSON)
            return
        }

        log.info message(code: 'default.created.message', args: [message(code: 'project.label', default: 'Project'), projectInstance.id])
        response.setStatus HttpServletResponse.SC_CREATED
        render (["message": message(code: 'default.created.message', args: [message(code: 'project.label', default: 'Project'), projectInstance.id])] as JSON)
    }

    def update(String id, Long version) {
        if (!request.JSON) {
            log.error "Not Acceptable error when parsing JSON"
            // TODO: create some wrapper for this as this should be in every save and update method
            response.sendError HttpServletResponse.SC_NOT_ACCEPTABLE
            render (["message": "Not Acceptable error when parsing JSON"] as JSON)
            return
        }

        def projectInstance = Project.get(new ObjectId(id))
        if (!projectInstance) {
            log.error message(code: 'default.not.found.message', args: [message(code: 'project.label', default: 'Project'), id])
            response.setStatus HttpServletResponse.SC_NOT_FOUND
            render (["message": message(code: 'default.not.found.message', args: [message(code: 'project.label', default: 'Project'), id])] as JSON)
            return
        }

        if (version != null) {
            if (projectInstance.version > version) {
                projectInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                          [message(code: 'project.label', default: 'Project')] as Object[],
                          "Another user has updated this Project while you were editing")
                log.warn "Another user has updated this Project while you were editing"
                response.sendError HttpServletResponse.SC_CONFLICT
                render (["message": "Another user has updated this Project while you were editing"] as JSON)
                return
            }
        }

        projectInstance.properties = params

        if (!projectInstance.save(flush: true)) {
            log.error projectInstance.errors
            response.sendError HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            render (["message": projectInstance.errors] as JSON)
            return
        }

        log.info message(code: 'default.updated.message', args: [message(code: 'project.label', default: 'Project'), projectInstance.id])
        response.setStatus HttpServletResponse.SC_OK
        render (["message": message(code: 'default.updated.message', args: [message(code: 'project.label', default: 'Project'), projectInstance.id])] as JSON)
    }

    def delete(String id) {
        def projectInstance = Project.get(new ObjectId(id))
        if (!projectInstance) {
            log.error message(code: 'default.not.found.message', args: [message(code: 'project.label', default: 'Project'), id])
            response.setStatus HttpServletResponse.SC_NOT_FOUND
            render (["message": message(code: 'default.not.found.message', args: [message(code: 'project.label', default: 'Project'), id])] as JSON)
            return
        }

        try {
            projectInstance.delete(flush: true)
            log.info message(code: 'default.deleted.message', args: [message(code: 'project.label', default: 'Project'), id])
            response.setStatus HttpServletResponse.SC_OK
            render (["message": message(code: 'default.deleted.message', args: [message(code: 'project.label', default: 'Project'), id])] as JSON)
        }
        catch (DataIntegrityViolationException e) {
            log.warn message(code: 'default.not.deleted.message', args: [message(code: 'project.label', default: 'Project'), id])
            response.setStatus HttpServletResponse.SC_CONFLICT
            render (["message": message(code: 'default.not.deleted.message', args: [message(code: 'project.label', default: 'Project'), id])] as JSON)
        }
    }
}
