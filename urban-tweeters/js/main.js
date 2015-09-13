var tweetIcon = L.icon({
    iconUrl: 'js/vendor/images/tweet.png',
    iconSize: [30, 30],
    shadowSize: [0, 0]
});

$(document).ready(function(){
    $('.dropdown-menu>li>a').on('click', function(e){
	$('#dropdown-ber').html($(this).text()+' <span class="caret"></span>');
    });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
	var target = $(e.target).attr('href');
	console.log(target);
	if(-1 == $.inArray(target, ['#ick','#dit','#jut','#wa'])){
    	    $('#dropdown-ber').html('Berlinerisch <span class="caret"></span>');
	}
    });
    var displayMarkers = function(id){
    	return function(markers){
	    $('a[data-toggle="tab"]').on('hide.bs.tab', function(e){
    		if($(e.target).attr('href') == id)leafMap.map.removeLayer(markers);
    		if($(e.relatedTarget).attr('href') == id)leafMap.map.addLayer(markers);
	    });
    	};
    };
    var addMarkers = function(url, id){
	$(id).tweetMarkers(url, leafMap.map,
			   {icon: tweetIcon,
			    onErrorMessage: "Tweet not found!",
			    displayMarkers: displayMarkers(id)});
    };
    leafMap.init();
    var geoLayer = L.control.layers();
    leafMap.addBaseGeo('data/LOR-Prognoseraeume.min.lang.json', "Prognoseräume", geoLayer);
    leafMap.addBaseGeo('data/LOR-Bezirksregionen.min.lang.json',"Bezirksregionen", geoLayer);
    leafMap.addBaseGeo('data/LOR-Planungsraeume.min.lang.json', "Planungsräume", geoLayer); 
    geoLayer.addTo(leafMap.map);
    addMarkers('data/kiez.min.json', '#kiez');
    addMarkers('data/ick.min.json', '#ick');
    addMarkers('data/dit.min.json', '#dit');
    addMarkers('data/jut.min.json', '#jut');
    addMarkers('data/wa.min.json', '#wa');    
});
