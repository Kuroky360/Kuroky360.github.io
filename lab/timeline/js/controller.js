angular.module('dvizer').controller('timelineCtrl',['$scope','dataService',function($scope,dataService){
    //mockData;
    $scope.config={
        data:dataService.MockData['1q'],
        dataExtent:[+new Date(2007,0),+new Date(2015,0)],
        fetchData:fetchDataByTimeBin,
        brushSelection:angular.noop
    };

    function fetchDataByTimeBin(bin) {
        return dataService.get(bin);
    }
}]);