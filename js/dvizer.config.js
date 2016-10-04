/**
 * 
 * Created by Kuroky360 on 10/3/16.
 */
(function(angular){
    angular.module('dvizer.config',[],['$provide',function($provide){
        var dir='lab/';
        $provide.value('$config',{
            "election":{
                "js":[
                    dir+'election/plugins/sigma.plugins.dragNodes/sigma.plugins.dragNodes.min.js',
                    dir+'election/plugins/sigma.plugins.filter/sigma.plugins.filter.min.js',
                    dir+'election/plugins/sigma.renderers.edgeLabels/sigma.renderers.edgeLabels.min.js',
                    dir+'election/plugins/sigma.renderers.customShapes/sigma.renderers.customShapes.min.js',
                    dir+'election/plugins/sigma.plugins.animate/sigma.plugins.animate.min.js',
                    dir+'election/js/controller.js',
                    dir+'election/js/directive.js',
                    dir+'election/js/service.js'
                ],
                "css":[
                    dir+'election/css/election.css'
                ]
            }
        })
    }]);
})(angular);
