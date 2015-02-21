'use strict';

angular.module('jhipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('invoice', {
                parent: 'entity',
                url: '/invoice',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'jhipsterApp.invoice.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/invoice/invoices.html',
                        controller: 'InvoiceController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('invoice');
                        return $translate.refresh();
                    }]
                }
            })
            .state('invoiceDetail', {
                parent: 'entity',
                url: '/invoice/:id',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'jhipsterApp.invoice.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/invoice/invoice-detail.html',
                        controller: 'InvoiceDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('invoice');
                        return $translate.refresh();
                    }]
                }
            });
    });
