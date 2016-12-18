angular.module('dvizer').controller('timelineCtrl',['$scope','dataService',function($scope,dataService){
    //mockData;
    $scope.config={
        data:dataService.MockData['1q'],
        dataExtent:[+new Date(2007,0),+new Date(2015,0)],
        fetchData:fetchDataByTimeBin,
        brushSelection:angular.noop
    };
    $scope.disqusConfig={
        disqus_shortname: 'www-dvizer-com',
        disqus_identifier: ''+new Date(),
        disqus_url: 'http://www.dvizer.com'
    };
    function fetchDataByTimeBin(bin) {
        return dataService.get(bin);
    }
}]);