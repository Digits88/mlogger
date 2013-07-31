class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

		"/"(view:"/index")
//        "/"(controller: "project", action: "index")
		"500"(view:'/error')

        // Project API
        "/projects"(controller: "project") {
            action = [GET: "list"]
        }
        "/projects"(controller: "project", parseRequest: true) {
            action = [POST: "save"]
        }
        // TODO: why /projects/$id is not working?
        "/project/update"(controller: "project", parseRequest: true) {
            action = [PUT: "update"]
        }
        // TODO: why /projects/$id is not working?
        "/project/delete/$id"(controller: "project") {
            action = [DELETE:"delete"]
        }

        // Source API
        "/sources"(controller: "source", action: "list") {
            action = [GET: "list"]
        }
        "/upload-full-form"(controller: "source", action:  "preview", parseRequest: true)

        "/source/save"(controller: "source", action:  "save", parseRequest: true) {
            action = [GET: "unsupported", PUT: "unsupported", DELETE: "unsupported", POST: "save"]
        }

//        "/events/$projectId?/$sourceId?/$maxPag?/$offsetPag?"(controller: "logViewer", action:  "list", parseRequest: true)
        "/events"(controller: "logViewer", action:  "list", parseRequest: true)

	}
}
