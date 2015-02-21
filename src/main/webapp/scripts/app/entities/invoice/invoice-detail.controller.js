'use strict';

angular.module('jhipsterApp')
    .controller('InvoiceDetailController', function ($scope, $stateParams, Invoice) {
        $scope.invoice = {};
        $scope.load = function (id) {
            Invoice.get({id: id}, function(result) {
              $scope.invoice = result;
            });
        };
        $scope.load($stateParams.id);
    });
