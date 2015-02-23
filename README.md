jhipster backend-less development
=================================

This is an example on how to configure a jhipster application so that frontend can be developed without the backend.

It is well explained [here](https://ruhul.wordpress.com/2014/11/03/backendless-development-with-angularjs/).

Benefits are:

  * faster development cycle
  * easier communication with customers as you can zip the webapp folder and send it to them for review
  * easier collaboration with designers
  * less coupling between resources (REST API) and entities (JPA, database)

In this example, only a part of the backend API is simulated in [src/main/webapp/scripts/app/stubs/httpBackendStub.js](src/main/webapp/scripts/app/stubs/httpBackendStub.js) but enough to authenticate with user or admin accounts and to use the CRUD view of an entity.

Unfortunately, this approach is not compatible with great new feature added in 2.3.0: BrowserSync support because the way Gruntfile.js is configured in jhipster proxies any request to the jhipster application running on port 8080

My solution is to have 2 BrowserSync configurations: 
- dev: the original one that uses a proxy for all requests
- backendLess: the new one that uses static server and works only with simulated backend

This is what is below, it could be improved by avoiding duplicating the list of files to watch.

~~~~ javascript
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'src/main/webapp/**/*.html',
                        'src/main/webapp/**/*.json',
                        'src/main/webapp/bower_components/**/*.{js,css}',
                        '{.tmp/,}src/main/webapp/assets/styles/**/*.css',
                        '{.tmp/,}src/main/webapp/scripts/**/*.js',
                        'src/main/webapp/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                       baseDir: [".tmp", "src/main/webapp"]
                    }
                }
            },
            backendLess: {
                bsFiles: {
                    src : [
                        'src/main/webapp/**/*.html',
                        'src/main/webapp/**/*.json',
                        'src/main/webapp/bower_components/**/*.{js,css}',
                        '{.tmp/,}src/main/webapp/assets/styles/**/*.css',
                        '{.tmp/,}src/main/webapp/scripts/**/*.js',
                        'src/main/webapp/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                    ]
                },
                options: {
                    watchTask: true,
                    proxy: "localhost:8080"
                }
            },
        },
~~~~

These 2 configurations are used by 2 tasks:
- `serve`: the original one that uses BrowserSync:dev
- `serve-client`: the new one that uses BrowserSync:backendLess

~~~~ javascript
    grunt.registerTask('serve', [
        'clean:server',
        'wiredep',
        'ngconstant:dev',
        'concurrent:server',
        'browserSync:dev',
        'watch'
    ]);

    grunt.registerTask('serve-client', [
        'clean:server',
        'wiredep',
        'ngconstant:dev',
        'concurrent:server',
        'browserSync:backendLess',
        'watch'
    ]);
~~~~




