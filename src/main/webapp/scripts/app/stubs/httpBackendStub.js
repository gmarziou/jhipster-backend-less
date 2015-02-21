'use strict';

/**
 * Simulates backend server API to be able to develop client code without server.
 */
(function (ng) {
    var accounts = {
        user:  {id: 0, login: 'user', password: 'user', email: 'user@example.com', roles: ['ROLE_USER']},
        admin: {id: 1, login: 'admin', password: 'admin', email: 'admin@example.com', roles: ['ROLE_USER', 'ROLE_ADMIN']}
    };

    var currentUser;

    // sample resource
    var invoices = [
        {id:0, date:'2015-01-10', amount:2100, status:0},
        {id:1, date:'2014-12-10', amount:2300, status:2},
        {id:2, date:'2014-11-10', amount:1500, status:2},
        {id:3, date:'2014-10-10', amount:3500, status:1},
        {id:4, date:'2014-09-10', amount:1500, status:2}
    ];

angular.module('jhipsterApp')
    .config(['$provide', function ($provide) {
        $provide.decorator('$httpBackend', ng.mock.e2e.$httpBackendDecorator);
    }]).run(['$httpBackend', function ($httpBackend) {

        // Simulated answers to API calls
        // The regexp covers the case where leading '/' is optional
        // Take into account angular-cache-buster that adds a query string parameter.

        $httpBackend.whenGET(/^\/?api\/account/).respond(function (method, url, data, headers) {
            if (currentUser)
                return [200, currentUser, {}];
            else
                return [401, {}, {}];
        });

        $httpBackend.whenPOST(/^\/?api\/account/).respond(function (method, url, data, headers) {
            currentUser = angular.fromJson(data);
            console.log('Account update requested:', method, url, data, headers);
            return [200, currentUser, {}];
        });

        $httpBackend.whenPOST(/^\/?api\/register/).respond(function (method, url, data, headers) {
            console.log('Account creation requested:', method, url, data, headers);
            if (data == '{}')
                return [401, {}, {}];
            else
                return [200, {}, {}];
        });

        $httpBackend.whenGET(/^\/?api\/activate/).respond();

        $httpBackend.whenPOST(/^\/?api\/authentication/).respond(function (method, url, data, headers) {
            var regex = /j_username=([\w]+)&/;
            var login = data.match(regex)[1];
            console.log('Authentication requested:', method, url, data, headers);
            if (login == 'undefined') {
                return [401, {status:401, error:'Unauthorized', message:'Access Denied', path:'/api/account'}, {}];
            } else {
                currentUser = accounts[login];
                return [200, {}, {}];
            }
        });

        $httpBackend.whenPOST(/^\/?api\/logout/).respond(function (method, url, data, headers) {
            console.log('Logout requested:', method, url, data, headers);
            currentUser = undefined;
            return [200, {}, {}];
        });

        $httpBackend.whenGET(/^\/?api\/logout/).respond();

        // Resources

        // Get all invoices
        $httpBackend.whenGET(/^\/?api\/invoices\?cacheBuster=\d+/).respond(invoices);
        // Get one invoice
        $httpBackend.whenGET(/^\/?api\/invoices\/\d+\?cacheBuster=\d+/).respond(function(method, url, data) {
            var id = url.match(/invoices\/(\d+)/)[1];

            var invoice = findOne(id, invoices);

            return [200, invoice, {}];
        });
        // Create a new invoice
        $httpBackend.whenPOST(/^\/?api\/invoices\?cacheBuster=\d+/).respond(function(method, url, data) {
            var params = angular.fromJson(data);

            var invoice = addOne(params, invoices);
             
            return [201, invoice, { Location: '/api/invoices/' + invoice.id }];
        });
        // Update of an existing invoice (ngResource does not send PUT for update)
        $httpBackend.whenPOST(/^\/?api\/invoices\/\d+\?cacheBuster=\d+/).respond(function(method, url, data) {
            var params = angular.fromJson(data);

            // parse the matching URL to pull out the id (/api/invoices/:id)
            var id = url.match(/invoices\/(\d+)/)[1];
            
            var invoice = updateOne(id, params);
            
            return [201, invoice, { Location: '/api/invoices/' + id }];
        });
        // Delete an invoice
        $httpBackend.whenDELETE(/^\/?api\/invoices\/\d+\?cacheBuster=\d+/).respond(function(method, url, data) {
            // parse the matching URL to pull out the id (/api/invoices/:id)
            var id = url.match(/invoices\/(\d+)/)[1];
            
            deleteOne(id, invoices);
            
            return [204, {}, {}];
        });    


        // Let's pass through other requests, in partcular those requesting scripts, views or json
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough

        // CRUD functions

        function findOne(id, data) {
            // find the item that matches that id
            var list = $.grep(data, function(item, index) {
                return (item.id == id);
            });
            if(list.length === 0) {
                return {};
            }
            return list[0];
        };
   
        // add a new data item that does not exist already
        // must compute a new unique id and backfill in
        function addOne(dataItem, data) {
            var last = data[data.length - 1];
            dataItem.id = last.id + 1;
            data.push(dataItem);
            return dataItem;
        };
        
        function updateOne(id, dataItem, data) {
            // find the item that matches that id
            var match = null;
            for (var i=0; i < games.length; i++) {
                if(data[i].id == id) {
                    match = data[i];
                    break;
                }
            }
            if(!angular.isObject(match)) {
                return {};
            }
            angular.extend(match, dataItem);
            return match;
        };
        
        function deleteOne(id, data) {
            // find the item that matches that id
            var match = false;
            for (var i=0; i < data.length; i++) {
                if(data[i].id == id) {
                    match = true;
                    data.splice(i, 1);
                    break;
                }
            }
            return match;
        };
    

    }]);
})(angular);