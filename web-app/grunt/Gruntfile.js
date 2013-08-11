/**
 @author Martin Micunda
 */

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        src: {
            css: ['../css/*.css'],
            angular: {
                js: ['../js/mlogger-app/**/*.js'],
                specs: ['../test/**/*.spec.js'],
                scenarios: ['/test/**/*.scenario.js']
            },
            tpl: ['../js/mlogger-app/**/**/*.html'],
            grails: {
                gsp: ['../../grails-app/views/**/*.gsp']
            }
        },
        jshint: {
            files: ['Gruntfile.js', '<%= src.angular.js %>'],
            options: {
                // options here to override JSHint defaults
                curly:true,
                eqeqeq:true,
                immed:true,
                latedef:true,
                newcap:true,
                noarg:true,
                sub:true,
                boss:true,
                eqnull:true,
                globals:{}
            }
        },
        watch: {
            options: {
                // Start a live reload server on the default port 35729
                livereload: true
            },
            files:['<%= src.angular.js %>', '<%= src.grails.gsp %>', '<%= src.css %>', '<%= src.tpl %>'],
            tasks:['default','timestamp']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    // Default task
    grunt.registerTask('default', ['jshint']);
};