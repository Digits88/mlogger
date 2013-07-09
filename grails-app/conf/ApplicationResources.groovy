import org.codehaus.groovy.grails.web.context.ServletContextHolder as SCH

modules = {
    angular {
        resource url:'/lib/angular/angular-1.0.7.min.js'
    }

    application {
        dependsOn 'angular'
        resource url: 'css/test.css'

//        resource url: 'src/app/'
//        getFilesForPath('src/app/controllers').each {
//          resource url: it
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