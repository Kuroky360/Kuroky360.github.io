/**
 *
 * Created by Kuroky360 on 10/3/16.
 */
(function (angular) {
    angular.module('dvizer', ['ui.router', 'oc.lazyLoad','dvizer.config'])
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
            /*$locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });*/
            $stateProvider.state('home', {
                url: '/',
                templateUrl: 'html/home.html'
            }).state('contact', {
                url: '/contact',
                templateUrl: 'html/contact.html'
            }).state('about', {
                url: '/about',
                templateUrl: 'html/about.html'
            }).state('election', {
                url: '/lab/election',
                templateUrl: 'lab/election/html/index.html',
                controller:'electionCtrl',
                resolve: {
                    deps: ['$ocLazyLoad','$config',function($ocLazyLoad,$config){
                        return $ocLazyLoad.load($config.election.js.concat($config.election.css));
                    }]
                }
            }).state('blog',{
                url: '/blog',
                templateUrl: 'blog/template.html'
            });
            $urlRouterProvider.otherwise('/');
        }])
        .controller('MainCtrl', ['$scope', '$state', function ($scope, $state) {
            $scope.$on('$stateChangeSuccess', function () {
                $scope.state = $state.current;
            });
        }]);
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['dvizer'])
    });
})(angular);
