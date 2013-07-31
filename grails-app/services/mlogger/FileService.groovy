package mlogger

import org.codehaus.groovy.grails.web.context.ServletContextHolder

class FileService {

//    boolean transactional = true

    def String uploadFile(def file, String name, String destinationDirectory) {
        log.info"***************** Start Uploading File *****************"
        def servletContext = ServletContextHolder.servletContext
        def storagePath = servletContext.getRealPath(destinationDirectory)

        // Create storage path directory if it does not exist
        File storagePathDirectory = new File(storagePath)
        if(!storagePathDirectory.exists()) {
            log.info"CREATING DIRECTORY ${storagePathDirectory}: "
            if(storagePathDirectory.mkdir()) {
                log.info"Creating SUCCESS"
            } else {
                log.error"Creating FAILED"
            }
        }

        // Store file
        if(!file.isEmpty()) {
            file.transferTo(new File("${storagePath}/${name}"))
            log.info"Saved file: ${storagePath}/${name}"
            log.info"*****************  End Uploading File  *****************"
            return "${storagePath}/${name}"
        } else {
            log.error"File ${file.inspect()} was empty"
            log.info"*****************  End Uploading File  *****************"
            return null
        }
    }

    def void deleteFile(String name, String destinationDirectory) {
        log.info"***************** Start Deletion File *****************"
        def servletContext = ServletContextHolder.servletContext
        def storagePath = servletContext.getRealPath(destinationDirectory)

        // Check if directory exist
        File storagePathDirectory = new File(storagePath)
        if(!storagePathDirectory.exists()) {
            log.error"Destination directory ${destinationDirectory} doesn't exist"
        } else {
            // Delete file
            File f1 = new File("${storagePath}/${name}");
            boolean success = f1.delete();
            if (!success)
                log.error"Deletion of file '${name}' FAILED"
            else
                log.info"Deletion of file '${name}' SUCCESS"
        }
        log.info"*****************  End Deletion File  *****************"
    }
}
