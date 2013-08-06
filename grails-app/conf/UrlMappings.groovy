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

        // ************ Project API
        //                          ************
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

        // ************ Source API
        //                          ************
        "/projects/$projectId?/sources"(controller: "source", action: "list") {
            action = [GET: "list"]
        }

        "/projects/$projectId?/sources/edit/$id"(controller: "source", action: "edit") {
            action = [GET: "edit"]
        }

        "/sources"(controller: "source", parseRequest: true) {
            action = [POST: "save"]
        }
        "/source/preview"(controller: "source", parseRequest: true) {
            action = [POST: "preview"]
        }

        // TODO: why /projects/$id is not working?
        "/projects/$projectId?/sources/delete/$id"(controller: "source") {
            action = [DELETE:"delete"]
        }

        // ************ Source API
        //                          ************
        "/events/save"(controller: "event", parseRequest: true) {
            action = [POST: "saveTest"]
        }

//        "/events/$projectId?/$sourceId?/$maxPag?/$offsetPag?"(controller: "logViewer", action:  "list", parseRequest: true)
        "/events"(controller: "logViewer", parseRequest: true) {
            action = [GET: "list"]
        }

	}
}
