var width = document.getElementById('container').offsetWidth-60;
var height = width/1.5;
var centered;

var width = screen.width,
    height = screen.height,
    centered;

var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden").attr("id", "tooltip");

var projection = d3.geo.mercator()
    .scale(230)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom));
    //.on("click", clicked);

var g = svg.append("g");

d3.json("world.json", function(error, map) {
  var w = document.getElementById('container').width;
  var h =document.getElementById('container').height;

  //color map
  var country = g.selectAll(".country")
   .data(topojson.feature(map,map.objects.subunits).features)
   .enter()
   .append("path")
   .attr("class", function(d) { return "country " + d.id; })
   .style("fill", function(){


    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  })
   .attr("d", path)
   .on("click", clicked)
   .on("mousemove", function(d,i) {
      showTooltip(d);
      })
      .on("mouseout",  function(d,i) {
        tooltip.classed("hidden", true)
      });
});

/* FUNCTIONS ============ */

function zoom() {

  g.transition()
      .duration(500)
    .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
};

function showTooltip(d) {
  var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
        tooltip
          .classed("hidden", false)
          .html(d.properties.name)
          .attr("style", function(d) {
            var tooltipWidth = parseInt(tooltip.style("width"));
            var left  = "left:"+(mouse[0]-tooltipWidth-10)+"px;top:"+(mouse[1]+10)+"px";
            var right = "left:"+(mouse[0]+15)+"px;top:"+(mouse[1]+10)+"px";
            return mouse[0] > width/2 ? left : right;
          })
      }

function zoomToCountry(k,x,y){
  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}


function clicked(d) {

  var x, y, k;

  if (centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  zoomToCountry(k,x,y)
}
