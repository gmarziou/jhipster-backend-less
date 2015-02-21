'use strict';

/**
 * Simulates backend server API to be able to develop client code without server.
 */
(function (ng) {
    // simple user
    var userAccount = {
        login: 'user',
        password: 'user',
        email: 'user@example.com',
        roles: ['ROLE_USER'],
    };

    // admin user
    var adminAccount = {
        login: 'admin',
        password: 'admin',
        email: 'admin@example.com',
        roles: ['ROLE_USER', 'ROLE_ADMIN'],
    };

// select simulated account
    var account = adminAccount;

    var invoices = [
        {id:7, date:'2015-01-10', amount:2100, status:0},
        {id:5, date:'2014-12-10', amount:2300, status:2},
        {id:3, date:'2014-11-10', amount:1500, status:2},
        {id:2, date:'2014-10-10', amount:3500, status:1},
        {id:1, date:'2014-09-10', amount:1500, status:2}
    ];

angular.module('jhipsterApp')
    .config(['$provide', function ($provide) {
        $provide.decorator('$httpBackend', ng.mock.e2e.$httpBackendDecorator);
    }]).run(['$httpBackend', function ($httpBackend) {

        // Simulated answers to API calls
        // The regexp covers the case where leading '/' is optional
        // Take into account angular-cache-buster that adds a query string parameter.

        $httpBackend.whenGET(/^\/?api\/account/).respond(account);
        $httpBackend.whenPOST(/^\/?api\/account/).respond(function (method, url, data, headers) {
            console.log('Account update requested:', method, url, data, headers);
            account = angular.fromJson(data);
            return [200, account, {}];
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
            console.log('Authentication requested:', method, url, data, headers);
            if (data == 'j_username=undefined&j_password=undefined&_spring_security_remember_me=false&submit=Login')
                return [401, {}, {}];
            else
                return [200, {}, {}];
        });

        $httpBackend.whenPOST(/^\/?api\/logout/).respond(function (method, url, data, headers) {
            console.log('Logout requested:', method, url, data, headers);
            return [200, {}, {}];
        });

        $httpBackend.whenGET(/^\/?api\/logout/).respond();

        // Entities

        $httpBackend.whenGET(/^\/?api\/invoices\?cacheBuster=\d+/).respond(invoices);


        // Laissons paszer les autres requêtes, en particulier pour les scripts et templates
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough();
    }]);
})(angular);