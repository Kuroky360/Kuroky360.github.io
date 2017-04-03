/**
 *
 * Created by Kuroky360 on 10/3/16.
 */
(function (angular) {
    angular.module('dvizer', ['ui.router', 'oc.lazyLoad','dvizer.config','angularUtils.directives.dirDisqus'])
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider','$compileProvider', function ($stateProvider, $urlRouterProvider, $locationProvider,$compileProvider) {
            $compileProvider.debugInfoEnabled(false);
            $locationProvider.hashPrefix('!');
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
            }).state('timeline', {
                url: '/lab/timeline',
                templateUrl: 'lab/timeline/html/index.html',
                controller: 'timelineCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', '$config', function ($ocLazyLoad, $config) {
                        return $ocLazyLoad.load($config.timeline.js.concat($config.timeline.css));
                    }]
                }
            }).state('blog',{
                url: '/blog',
                controller:function($scope){
                    $scope.disqusConfig={
                        disqus_shortname: 'www-dvizer-com',
                        disqus_identifier: ''+new Date(),
                        disqus_url: 'http://www.dvizer.com'
                    };
                },
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
