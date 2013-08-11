import org.codehaus.groovy.grails.web.context.ServletContextHolder as SCH
import grails.util.GrailsUtil

def fileVersion = GrailsUtil.isDevelopmentEnv() ? '1.0.6' : '1.0.6.min'

modules = {
    jquery {
        resource url: '/lib/jquery/jquery-1.9.1.min.js'
    }

    ngUpload {
        resource url: '/lib/angular-ng-upload/ng-upload.js'
    }

    underscore {
        resource url: '/lib/underscore/underscore-min.js'
    }

    bootstrap {
        resource url: '/css/bootstrap/bootstrap.css'
    }

    angular {
        resource url:'/lib/angular/angular-1.0.7.min.js'
        resource url:'/lib/angular-resource/angular-resource-1.0.7.min.js'
//        resource url:'/lib/angular-ui/ui-bootstrap-0.4.0.js'
//        resource id: 'js', url: [plugin: 'angular-scaffolding', dir: 'js/angular', file: "angular-${fileVersion}.js"], nominify: true
    }

    angularUi {
        dependsOn 'angular, bootstrap'
        resource url:'/lib/angular-ui/ui-bootstrap-tpls-0.5.0.js'
    }

    angularApplication {
        dependsOn 'angular, ngUpload, underscore, angularUi'
        defaultBundle false
        resource url:'/js/mlogger-app/app.js'
        resource url:'/js/mlogger-app/log-viewer/log-viewer.js'
        resource url:'/js/mlogger-app/projects/projects.js'
        resource url:'/js/mlogger-app/source/SourceService.js'
        resource url:'/js/mlogger-app/source/configuration/source-configuration.js'
        resource url:'/js/mlogger-app/source/preview/source-preview.js'
        resource url:'/js/mlogger-app/administration/administration.js'
    }

    application {
        dependsOn 'angularApplication, jquery, bootstrap, angularUi'
        resource url: 'css/test.css'

//        getFilesForPath('js/').each {
//            resource url: it
//        }
    }
}

//def getFilesForPath(path) {
//
//    def webFileCachePaths = []
//
//    def servletContext = SCH.getServletContext()
//
//    //context isn't present when testing in integration mode. -jg
//    if(!servletContext) return webFileCachePaths
//
//    def realPath = servletContext.getRealPath('/')
//
//    def appDir = new File("$realPath/$path")
//
//    appDir.eachFileRecurse {File file ->
//        if (file.isDirectory() || file.isHidden()) return
//        webFileCachePaths << file.path.replace(realPath, '')
//    }
//
//    webFileCachePaths
//}