angular.module('dvizer').directive('electionViz', ['$timeout',function ($timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="election-graph-container"></div>',
        scope: {
            graph:'=',
            urls: '='
        },
        link: function (scope, element) {
            var sigmaInstance,
                edges = [],
                nodes = [],
            greyColor = '#fff',
            node_hoverColor = '#e00022',//00ff00,00a80c,e00022
            g = {
                    nodes: [],
                    edges: []
                },
            loaded = 0;
            element.parent().on('contextmenu', function (event) {
                event.preventDefault();
            });
            sigma.utils.pkg('sigma.canvas.nodes');
            sigma.canvas.nodes.image = sigma.canvas.nodes.image||(function () {
                var _cache = {},
                    _loading = {},
                    _callbacks = {};
                // Return the renderer itself:
                var renderer = function (node, context, settings) {
                    var args = arguments,
                        prefix = settings('prefix') || '',
                        size = node[prefix + 'size'],
                        color = node.color || settings('defaultNodeColor'),
                        url = node.url;

                    if (_cache[url]) {
                        context.save();

                        // Draw the clipping disc:
                        context.beginPath();
                        context.arc(
                            node[prefix + 'x'],
                            node[prefix + 'y'],
                            node[prefix + 'size'],
                            0,
                            Math.PI * 2,
                            true
                        );
                        context.closePath();
                        context.clip();

                        // Draw the image
                        context.drawImage(
                            _cache[url],
                            node[prefix + 'x'] - size,
                            node[prefix + 'y'] - size,
                            2 * size,
                            2 * size
                        );

                        // Quit the "clipping mode":
                        context.restore();

                        // Draw the border:
                        context.beginPath();
                        context.arc(
                            node[prefix + 'x'],
                            node[prefix + 'y'],
                            node[prefix + 'size'],
                            0,
                            Math.PI * 2,
                            true
                        );
                        context.lineWidth = size / 5;
                        context.strokeStyle = node.color || settings('defaultNodeColor');
                        context.stroke();
                    } else {
                        sigma.canvas.nodes.image.cache(url);
                        sigma.canvas.nodes.def.apply(
                            sigma.canvas.nodes,
                            args
                        );
                    }
                };

                // Let's add a public method to cache images, to make it possible to
                // preload images before the initial rendering:
                renderer.cache = function (url, callback) {
                    if (callback)
                        _callbacks[url] = callback;

                    if (_loading[url])
                        return;

                    var img = new Image();

                    img.onload = function () {
                        _loading[url] = false;
                        _cache[url] = img;

                        if (_callbacks[url]) {
                            _callbacks[url].call(this, img);
                            delete _callbacks[url];
                        }
                    };

                    _loading[url] = true;
                    img.src = url;
                };

                return renderer;
            })();
            // Instantiate sigma:
            sigmaInstance = new sigma({
                graph: g,
                renderer: {
                    container: element[0],
                    type: 'canvas'
                },
                settings: {
                    minEdgeSize: 0.01,
                    maxEdgeSize: 0.1,
                    minNodeSize: 0.2,
                    maxNodeSize: 13,
                    labelThreshold: 100,
                    nodesPowRatio: 0.5,
                    edgesPowRatio: 0.8,
                    batchEdgesDrawing: true,
                    doubleClickEnabled: false,
                    hideEdgesOnMove: true,
                    zoomingRatio: 2.8,
                    zoomMin: 0.01,
                    mouseInertiaDuration: 100,
                    mouseZoomDuration: 200,
                    borderSize: 0,
                    hoverFontStyle: 'bold',
                    labelHoverShadow: 'default',
                    labelHoverShadowColor: node_hoverColor,
                    labelHoverBGColor: 'default',
                    defaultHoverLabelBGColor: node_hoverColor,
                    enableEdgeHovering: false,
                    edgeHoverExtremities: false,
                    defaultEdgeType: 'def',
                    labelHoverColor: 'default',
                    defaultLabelHoverColor: '#fff',
                    //edgeLabels
                    edgeLabelSize: 'proportional',
                    edgeLabelThreshold: 0.7,
                    defaultEdgeLabelColor: '#fff',
                    defaultEdgeLabelSize: 10
                }
            });
            sigmaInstance.bind('overNodes', nodes_over_function)
                .bind('outNodes', nodes_out_function);
            // Initialize the dragNodes plugin:
            sigma.plugins.dragNodes(sigmaInstance, sigmaInstance.renderers[0]);
            // Initialize the Filter API
            new sigma.plugins.filter(sigmaInstance);

            scope.$watch("urls", function (newVal, oldVal) {
                loaded = 0;
                // Then, wait for all images to be loaded before instanciating sigma:
                scope.urls.forEach(function (url) {
                    sigma.canvas.nodes.image.cache(
                        url,
                        function () {
                            if (++loaded === scope.urls.length) {
                                sigmaInstance.graph.clear();
                                sigmaInstance.graph.read(scope.graph);
                                init(sigmaInstance);
                            }
                        });
                });
            });

            function init(s) {
                edges = s.graph.edges();
                nodes = s.graph.nodes();
                s.refresh();
                s.cameras[0].goTo({x: 0, y: 0, angle: 0, ratio: 0.15});
            }

            function nodes_over_function(event) {
                var overNodes = _convertToStringArray(event.data.nodes);
                var neighbors = {};
                edges.forEach(function (e) {
                    if (overNodes.indexOf(e.source) < 0 && overNodes.indexOf(e.target) < 0) {
                        // not edge for overNodes
                        if (!e.attributes['grey']) {
                            e.attributes['true_color'] = e.color;
                            e.attributes['true_hidden'] = e.hidden;
                            e.color = greyColor;
                            e.attributes['grey'] = 1;
                        }
                    } else {
                        // edge for overNodes
                        e.color = e.attributes['grey'] ? e.attributes['true_color'] : e.color;
                        e.attributes['grey'] = 0;
                        neighbors[e.source] = 1;
                        neighbors[e.target] = 1;
                    }
                 });
                nodes.forEach(function (n) {
                    if (!neighbors[n.id]) {
                 // not node for neighbors of overNode
                        if (!n.attributes['grey']) {
                            n.attributes['true_color'] = n.color;
                            n.color = greyColor;
                            n.attributes['grey'] = 1;
                        }
                    } else {
                 // node for neighbors of overNode
                        n.active=true;
                        n.color = n.attributes['grey'] ? n.attributes['true_color'] : n.color;
                        n.attributes['grey'] = 0;
                    }
                 });
                sigmaInstance.refresh();

                function _convertToStringArray(objArray) {
                    var result = [];
                    result = objArray.map(function (item) {
                        return item.id;
                    });
                    return result;
                }
            }

            function nodes_out_function() {
                edges.forEach(function (e) {
                    e.color = e.attributes['grey'] ? e.attributes['true_color'] : e.color;
                    e.attributes['grey'] = 0;
                 });
                nodes.forEach(function (n) {
                    n.color = n.attributes['grey'] ? n.attributes['true_color'] : n.color;
                    n.attributes['grey'] = 0;
                    n.active=false;
                 });
                sigmaInstance.refresh();
            }
        }
    };
}]);
