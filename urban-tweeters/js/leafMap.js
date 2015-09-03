var leafMap = function(){
    var center = [52.5167, 13.3833];
    var map = L.map('map');
    var tileUrl = 'http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png';
    var tileAttr = 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    var mapLayer = L.tileLayer(tileUrl, {
	attribution: tileAttr,
	maxZoom: 18,
	minZoom: 0
    });
    var addStatsLayer = function(geojsonURL){
	$.getJSON(geojsonURL, function(data){
	    L.geoJson(data, {
		style: {
		    fillColor : 'gray',
		    weight : 2,
		    opacity : 0.4,
		    color : 'white',
		    dashArray : 3,
		    fillOpacity : 0.4
		},
		onEachFeature: function (feature, layer){
		    layer.bindPopup(feature.properties.name);
		}
	    }).addTo(map); 
	});
    };

    return {
	map: map,
	init: function(){
	    map.setView(center, 13);
	    map.addLayer(mapLayer);
	},
	addMarker: function(latlng){
	    L.marker(latlng).addTo(map);
	},
	addStatsLayer: addStatsLayer
    };
    
}();

// var tileUrl = 'http://a{s}.acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png';
// var tileAttr = '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth';
// 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
// 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
