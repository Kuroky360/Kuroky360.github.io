angular.module('dvizer').service('electionService', ['$http', '$log', function ($http, $log) {

    var self = this;

    this.intimacyData = {};
    this.intimacyImageUrls = [];

    this.fetchIntimacyData = function () {
        return $http.get('lab/election/data/data3_forceAtlas2Layout.json').then(function (json) {
            self.intimacyImageUrls = _extractImageUrl(json.data);
            self.intimacyData = json.data;
        });
    };

    function _extractImageUrl(data) {
        var urls = [],
            prefix,
            noRepeat = {},
            nodes = data.nodes,
            edges = data.edges;
        
        prefix = 'election/avatar/';
        nodes.forEach(function (item) {
            // process image
            if (item.attributes.Image) {
                if (angular.isString(item.attributes.Image)) item.attributes.Image = item.attributes.Image.trim();
                item.type = 'image';
                item.url = prefix + item.attributes.Image;
                if (!noRepeat[item.attributes.Image]) {
                    noRepeat[item.attributes.Image] = true;
                    urls.push(prefix + item.attributes.Image);
                }
            } else {
                item.type = 'def';
                item.url = null;
            }
        });
        nodes.forEach(function (item) {
            item.hidden = false;
            item.color = '#908BF7';//#fff,0027cc,0b0085,0070c2
        });

        edges.forEach(function (item) {
            item.color = '#908BF7';//908BF7,0027cc,0b0085,FE6A37
            item.hidden = false;
        });
        return urls;
    }
}]);