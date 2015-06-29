var width = 960,
height = 1160;

var svg = d3.select("body")
.append("svg")
.attr("width", width)
.attr("height", height);

var projection = d3.geo.albers()
.center([0, 55.4])
.rotate([4.4, 0])
.parallels([50, 60])
.scale(2000)
.translate([width / 2, height/2]);

var path = d3.geo.path()
.projection(projection);




d3.json("world.json", function(error, map){
	if (error) return console.error(error);
	
	svg.selectAll(".subunit")
	.data(topojson.feature(map, map.objects.subunits).features)
	.enter()
	.append("path")
	.attr("class", function(d) { return "subunit " + d.id; })
	.attr("d", path)
	.style("fill", function(){
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	});

	svg.append("path")
	.datum(topojson.mesh(map, map.objects.subunits, function(a, b) { return a !== b; }))
	.attr("d", path)
	.attr("class", "subunit-boundary");

	svg.append("path")
	.datum(topojson.feature(map, map.objects.places))
	.attr("d", path)
	.attr("class", "place");

	svg.selectAll(".place-label")
	.data(topojson.feature(map, map.objects.places).features)
	.enter()
	.append("text")
	.attr("class", "place-label")
	.attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
	.attr("dy", ".35em")
	.text(function(d) { return d.properties.name; });

	svg.selectAll(".place-label")
	.attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6 })
	.style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end" });

	svg.selectAll(".subunit-label")
	.data(topojson.feature(map, map.objects.subunits).features)
	.enter()
	.append("text")
	.attr("class", function(d) { return "subunit-label " + d.id; })
	.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
	.attr("dy", ".35em")
	.text(function(d) { return d.properties.name; });
});
