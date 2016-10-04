angular.module('dvizer').controller('electionCtrl', ['$scope', 'electionService', function ($scope, electionService) {

    $scope.graphData = {};
    $scope.graphImageUrls = [];
    electionService.fetchIntimacyData().then(function () {
        $scope.graphData = electionService.intimacyData;
        $scope.graphImageUrls = electionService.intimacyImageUrls;
    });

}]);