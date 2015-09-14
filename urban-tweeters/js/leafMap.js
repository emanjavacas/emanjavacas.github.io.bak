var leafMap = function(){
    // map
    var max = {0:0,1:0,2:0};
    var myScale = d3.scale.quantize()
	.range(colorbrewer.Greens[6]);
    var scales = {0:myScale,1:myScale,2:myScale};
    var southWest = L.latLng(52.25, 13.00),
    northEast = L.latLng(52.70, 13.80),
    bounds = L.latLngBounds(southWest, northEast),
    center = L.latLng(52.5167, 13.3833);
    var map = L.map('map');
    map.setMaxBounds(bounds);
    var tileUrl = 'http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png';
    var tileAttr = 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    var mapLayer = L.tileLayer(tileUrl, {
	attribution: tileAttr,
	maxZoom: 18,
	minZoom: 11,
	bounds: bounds
    });
    var defaultStyle = {
	fillColor : '#e3f4cb',
	weight : 3,
	opacity : 0.7,
	color : '#666',
	dashArray : 3,
	fillOpacity : 0
    };
    var values = function(obj){
	var result = [];
	for(var prop in obj){
	    if (obj.hasOwnProperty(prop)) result.push(obj[prop]);
	}
	return result;
    };
    var summation = function(vals){
	var result = 0;
	for (var i = vals.length; i--;) result += vals[i];
	return result;
    };
    var hill = function(counts, n){
	var total = summation(counts);
	var ps = counts.map(function(e){return e/total;});
	var result = 0;
	switch(n){
	case 0: 
	    result = ps.length;
	    break;
	case 1: 
	    for (var i = ps.length; i--;) result += (ps[i] * Math.log(ps[i]));
	    result = Math.exp(-result);
	    break;
	case 2:
	    for (var j = ps.length; j--;) result += Math.pow(ps[j], 2);
	    result = 1 / result;
	    break;
	}
	return result;
    };    
    var getColor = function(feature, hillN){
	return scales[hillN](feature.properties['hill' + hillN]);
    };
    var onEachFeature = function(feature, layer){
	// layer.bindPopup(feature.properties.name);
	layer.on({
	    mouseover : function (e){
		e.target.setStyle({
		    weight : 5,
		    color: '#666',
		    dashArray : '',
		    fillOpacity: 0.4
		});
		e.target.bringToFront();
		if ($('#stats').hasClass('active') && $('.chart')){
		    $('#lor').text(feature.properties.name);
		    chartD3.draw(feature.properties.langs);
		}
	    },
	    mouseout : function (e){		
		e.target.setStyle(defaultStyle);
	    }
	});
    };    
    var addBaseGeo = function(geojsonURL, layerName, control){
	$.getJSON(geojsonURL).then(
	    function(data){
		data['features'].forEach(// compute max hill & hill
		    function(feature){
			var vals = values(feature.properties.langs.map(
			    function(d){return d.value;}));
			for(var i = 0; i<3; i++) {
			    var myHill = hill(vals, i);
			    max[i] = Math.max(max[i], myHill);
			    feature.properties['hill'+i] = myHill;
			}
		    });
		for (var i = 0; i<3; i++) { // set color scales
		    scales[i].domain([0,max[i]]);
		}
		var geojson = L.geoJson(data, {
		    style: defaultStyle,
		    onEachFeature: onEachFeature
		});
		var geojsonHill = L.geoJson(data, {		    
		    style: function(feature){
			var myStyle = $.extend({}, defaultStyle);
			myStyle.fillColor = getColor(feature, 1);
			myStyle.opacity = 0;
			myStyle.fillOpacity = 0.8;
			return myStyle;
		    }
		});
		control.addBaseLayer(geojson, layerName);
		control.addOverlay(geojsonHill, layerName + " diversity");
	    },
	    function(jqxhr, textStatus, error){
		var err = textStatus + ", " + error;
		console.log(layerName + " Failed: " + err );
	    }).done();
    };

    return {
	scales: scales,
	map: map,
	addBaseGeo: addBaseGeo,	    
	init: function(){
	    map.setView(center, 13);
	    map.addLayer(mapLayer);
	}
    };
}();

		
