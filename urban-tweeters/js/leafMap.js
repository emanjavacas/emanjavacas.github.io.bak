var leafMap = function(){
    // map
    var center = [52.5167, 13.3833];
    var map = L.map('map');
    var tileUrl = 'http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png';
    var tileAttr = 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    var mapLayer = L.tileLayer(tileUrl, {
	attribution: tileAttr,
	maxZoom: 18,
	minZoom: 0
    });
    var defaultStyle = {
	fillColor : '#e3f4cb',
	weight : 3,
	opacity : 0.7,
	color : '#666',
	dashArray : 3,
	fillOpacity : 0
    };
    var onEachFeature = function(feature, layer){
	layer.bindPopup(feature.properties.name);
	layer.on({
	    mouseover : function (e){
		e.target.setStyle({
		    weight : 5,
		    color : '#666',
		    dashArray : '',
		    fillOpacity : 0.4
		});
		e.target.bringToFront();
		if ($('#stats').hasClass('active')){
		    $('#stats').text(feature.properties.name);
		}
	    },
	    mouseout : function (e){
		e.target.setStyle(defaultStyle);
	    }
	});
    };    
    var addBaseGeo = function(geojsonURL, layerName, control){
	$.getJSON(geojsonURL).done(
	    function(data){
		var geojson = L.geoJson(data, {
		    style: defaultStyle,
		    onEachFeature: onEachFeature
		});
		control.addBaseLayer(geojson, layerName);
	    }
	).fail(
	    function(jqxhr, textStatus, error){
		var err = textStatus + ", " + error;
		console.log(layerName + " Failed: " + err );
	    }
	);
    };
    return {
	map: map,
	addBaseGeo: addBaseGeo,	    
	init: function(){
	    map.setView(center, 13);
	    map.addLayer(mapLayer);
	}
    };
}();

		
