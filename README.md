jhipster backend-less development
=================================

This is an example on how to configure a jhipster application so that frontend can be develop without the backend.

It is well explained [here](https://ruhul.wordpress.com/2014/11/03/backendless-development-with-angularjs/).

Benefits are:

  * faster development cycle
  * easier communication with customers as you can zip the webapp folder and send it to them for review
  * easier collaboration with designers
  * less coupling between resources (REST API) and entities (JPA, database)

In this example, only a part of the backend API is simulated in [src/main/webapp/scripts/app/stubs/httpBackendStub.js](src/main/webapp/scripts/app/stubs/httpBackendStub.js) but enough to authenticate with user or admin accounts and to use the CRUD view of an entity.

Unfortunately, this approach is not compatible with great new feature added in 2.3.0: BrowserSync support.
I'm still investigating why but so far it seems that:
  * It could be a [problem for Windows users](http://www.browsersync.io/docs/#windows-users)
  * The way Gruntfile.js is configured in jhipster would proxy any request to the jhipster application running on port 8080

So, I back-ported the livereload feature of 2.2.0 in Gruntfile.js and binded it to a new grunt task: serve-client.


