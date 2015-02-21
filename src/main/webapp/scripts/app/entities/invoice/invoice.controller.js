'use strict';

angular.module('jhipsterApp')
    .controller('InvoiceController', function ($scope, Invoice) {
        $scope.invoices = [];
        $scope.loadAll = function() {
            Invoice.query(function(result) {
               $scope.invoices = result;
            });
        };
        $scope.loadAll();

        $scope.create = function () {
            Invoice.save($scope.invoice,
                function () {
                    $scope.loadAll();
                    $('#saveInvoiceModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            Invoice.get({id: id}, function(result) {
                $scope.invoice = result;
                $('#saveInvoiceModal').modal('show');
            });
        };

        $scope.delete = function (id) {
            Invoice.get({id: id}, function(result) {
                $scope.invoice = result;
                $('#deleteInvoiceConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Invoice.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteInvoiceConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.clear = function () {
            $scope.invoice = {date: null, amount: null, status: null, id: null};
        };
    });
