package mlogger

import org.springframework.dao.DataIntegrityViolationException

class SourceController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }

    def list(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        [sourceInstanceList: Source.list(params), sourceInstanceTotal: Source.count()]
    }

    def create() {
        [sourceInstance: new Source(params)]
    }

    def save() {
        def sourceInstance = new Source(params)
        if (!sourceInstance.save(flush: true)) {
            render(view: "create", model: [sourceInstance: sourceInstance])
            return
        }

        flash.message = message(code: 'default.created.message', args: [message(code: 'source.label', default: 'Source'), sourceInstance.id])
        redirect(action: "show", id: sourceInstance.id)
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
