// Locations
var antwerp = [51.21828, 4.428444];
// Create map and set it to Antwerp
var map = L.map('map').setView(antwerp, 14);
var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

L.tileLayer('http://a.tile.stamen.com/toner/{z}/{x}/{y}.png', {
    // http://a.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png
    // http://a.basemaps.cartocdn.com/light_all/s{z}/s{x}/s{y}.png
    // http://a.tile.stamen.com/toner/{z}/{x}/{y}.png    
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
    minZoom: 0
}).addTo(map);

// show coordinates when clicking
var pop = L.popup();
function onMapClick(e) {   
    var round = function(num){
	return Math.round(num * 10000)/10000;
    };
    var lat = round(e.latlng.lat);
    var lng = round(e.latlng.lng);
    pop
	.setLatLng(e.latlng)
	.setContent("Coordinates: " + "[<b>" + lat + ", " + lng + "</b>]")
	.openOn(map);
}
map.on('click', onMapClick);

function highlightFeature(e){
    var layer = e.target;
    layer.setStyle({
	weight : 5,
	color : '#666',
	dashArray : '',
	fillOpacity : 0.7
    });
    layer.bringToFront();
    info.update(layer.feature.properties);
}

var geojson;
function resetHighlight(e){
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e){
    map.fitBounds(e.target.getBounds());
}

var antwerpenUrl = "https://raw.githubusercontent.com/emanjavacas/urban-tweeters/master/resources/hoods/antwerp.geojson";

$.getJSON(antwerpenUrl, function(data){
    var states = data["features"];
    var colors = {};
    $.each(states, function (key, val) {
	i = val.properties.wijkcode;
	colors[i] = randomColor();
    });
    geojson = L.geoJson(states, {
	style : function (feature) { 
	    return {
		fillColor : colors[feature.properties.wijkcode],
		weight : 2,
		opacity : 0.4,
		color : 'white',
		dashArray : 3,
		fillOpacity : 0.4
	    };
	},
	onEachFeature : function (feature, layer) {
	    layer.on({
		mouseover : highlightFeature,
		mouseout : resetHighlight,
		click : zoomToFeature
	    });
	}
    }).addTo(map);
});

info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // <div class="info">
    this.update();
    return this._div;
};

info.update = function(props){
    this._div.innerHTML = '<h4>Wijkinfo</h4>' + 
	(props ? 'Wijknaam: <b>' + props.wijknaam + '</b><br>' + 'Wijkcode: <b>' + props.wijkcode + '</b>' :
	 "Hover over a Wijk");
};

info.addTo(map);
