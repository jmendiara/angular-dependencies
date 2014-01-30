'use strict';

/* Directives */

sigma.publicPrototype.myCircularLayout = function() {
  var R = 0.6,
      i = 0,
      L = this.getNodesCount();

  this.iterNodes(function(n){
    n.x = (Math.cos(Math.PI*(i++)/L)*R);
    n.y = (Math.sin(Math.PI*(i++)/L)*R);
  });

  return this.position(0,0,1).draw();
};

angular.module('ngDeps.directives', []).
    directive('appName', ['name', function ($name){
      return function(scope, elm, attrs) {
        elm.text($name);
      };
    }]).
    directive('angularVersion', function() {
      return function(scope, elm, attrs) {
        elm.text(angular.version.full);
      };
    }).
    directive('sigmaGraph', function() {
      return function(scope, domElement, attrs) {
        var sigInst = sigma.init(domElement[0]);


        var greyColor = '#666';
        sigInst.bind('overnodes',function(event){
          var nodes = event.content;
          var target = event.content[0];
          var neighbors = {};
          sigInst.iterEdges(function(e){
            if(nodes.indexOf(e.source)<0 && nodes.indexOf(e.target)<0){
              if(!e.attr['grey']){
                e.attr['true_color'] = e.color;
                e.color = greyColor;
                e.attr['grey'] = 1;
              }
            }

            if(nodes.indexOf(e.source)>=0 || nodes.indexOf(e.target)>=0){
              neighbors[e.source] = 1;
              neighbors[e.target] = 1;
            }
          }).iterNodes(function(n){
            if(!neighbors[n.id]){
                  if(!n.attr['grey']){
                    n.attr['true_color'] = n.color;
                    n.color = greyColor;
                    n.attr['grey'] = 1;
                  }
              n.hidden = 1;
            }else {
                  n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
                  n.attr['grey'] = 0;

              n.hidden = 0;
            }
            if (n.id === target){
              n.hidden = 0;
            }
          });
          sigInst.draw(2,2,2);
        }).bind('outnodes',function(){
          sigInst.iterEdges(function(e){
                e.color = e.attr['grey'] ? e.attr['true_color'] : e.color;
                e.attr['grey'] = 0;
            e.hidden = 0;
          }).iterNodes(function(n){
                    n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
                    n.attr['grey'] = 0;
            n.hidden = 0;
          }).draw(2,2,2);
        });


        sigInst.drawingProperties({
          defaultLabelColor: '#ccc',
          font: 'Arial',
          fontSize: '16px',
          edgeColor: 'source',
          defaultEdgeType: 'curve'
        }).graphProperties({
              minNodeSize: 1,
              maxNodeSize: 10
        });

        angular.forEach(scope.nodes, function (node){
          sigInst.addNode(node,{
            label: node,
            color: 'rgb('+Math.round(Math.random()*256)+','+
                Math.round(Math.random()*256)+','+
                Math.round(Math.random()*256)+')'
          });
        });

        var id = 0;
        angular.forEach(scope.edges, function (edge){
          sigInst.addEdge(id++, edge.src, edge.dst);
        });

        sigInst.myCircularLayout();
      };
    })
;
