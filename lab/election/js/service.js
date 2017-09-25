angular.module('dvizer').service('electionService', ['$http', '$log', function ($http, $log) {

    var self = this;

    this.intimacyData = {};
    this.intimacyImageUrls = [];

    this.fetchIntimacyData = function () {
        return $http.get('lab/election/data/data.json').then(function (json) {
            self.intimacyImageUrls = _extractImageUrl(json.data);
            self.intimacyData = json.data;
        });
    };

    function _extractImageUrl(data) {
        var urls = [],
            prefix,
            noRepeat = {},
            nodes = data.nodes,
            edges = data.edges,
            names;

        prefix = 'lab/election/avatar/';
        names=['9B8.jpg','ABE1.jpg','Aemon.jpg','Arya.jpg','B97C.jpg','Bran.jpg','Catelyn.jpg','Cersei.jpg','Daenerys.jpg','DB9.jpg','Drogo.jpg','Eddard.jpg','Jaime.jpg','Jeor.jpg','Jon.jpg','Jorah.jpg','Renly.jpg','Robb.jpg','Robert.jpg','Samwell.jpg','Sansa.jpg','Stannis.jpg','Tyrion.jpg','Tywin.jpg','Viserys.jpg'];
        urls=names.map(function(item){
            return prefix+item;
        });
        nodes.forEach(function (item) {
            // process image
            if (item.attributes.Image) {
                item.type = 'image';
                var random=Math.floor(Math.random()*25);
                item.url = urls[random];
                item._label=names[random].replace(/\.jpg/,'');
            } else {
                item.type = 'def';
                item.url = null;
                item._label='noone';
            }
        });
        edges.forEach(function (item) {
            item.color = '#908BF7';//908BF7,0027cc,0b0085,FE6A37
            item.hidden = false;
            noRepeat[item.source]=true;
            noRepeat[item.target]=true;
        });
        nodes.forEach(function (item) {
            if(noRepeat[item.label]) item.hidden=false; else item.hidden=true;
            item.color = '#908BF7';//#fff,0027cc,0b0085,0070c2
        });

        return urls;
    }
}]);
