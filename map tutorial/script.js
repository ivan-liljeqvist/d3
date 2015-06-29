d3.select(window).on("resize", throttle);

var width = screen.width,
    height = screen.height,
    centered;

function zoom(k,x,y){
  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}

function doubleClicked(d){
  
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

  zoom(k,x,y)
}


var projection = d3.geo.mercator()
    .scale(230)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

var g = svg.append("g");

d3.json("world.json", function(error, uk) {




  //color map
  g.selectAll(".subunit")
   .data(topojson.feature(uk,uk.objects.subunits).features)
   .enter()
   .append("path")

   .attr("class", function(d) { return "subunit " + d.id; })
   .style("fill", function(){
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  })
   .attr("d", path).on("click", clicked);
});

var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
}