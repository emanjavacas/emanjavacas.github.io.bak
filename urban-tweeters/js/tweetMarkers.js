// AUTHOR: Enrique
// DESCRIPTION: A very tiny jQuery plugin for adding Leaflet Marker functionality
// and assign a DOM element to show information attached to that marker. In its
// present state it does not abstract over showing a collection of tweets loaded
// with a strict format (a JSON array of {coordinates:[],user:"",id:""})
// ARGUMENTS: 'path/to/resource', targetMap, options
// EXAMPLE: $('#myTabPane').tweetMarkers('path/to/resource', options)
// DEPENDENCIES: Leaflet, jQuery

function buildOpts(opts){
    return Object.keys(opts).reduce(function(acc, k){
	return acc + k + "=" + opts[k] + "&";
    }, "&");
};

function buildOEmbed(user, tweet, opts){
    var path = "https://api.twitter.com/1/statuses/oembed.json?url=https://twitter.com/";
    return path + user + "/status/" + tweet + buildOpts(opts || {});
};

function getTweetHtml(user, tweet){// return a promise
    var cachedTweets = {};
    return new Promise(function(resolve, reject){
	if (cachedTweets[user+tweet]) resolve(cachedTweets[user+tweet]);	
	else {$.ajax({
	    dataType: "jsonp",
	    timeout: 1000,
	    url: buildOEmbed(user, tweet,
			     {omit_script: "true",
			      hide_thread: "true",
			      hide_media: "true"}),
	    success: function(data, textStatus, xOptions){
		cachedTweets[user+tweet] = data.html;
		resolve(data.html);},
	    error: function(xOptions, textStatus){
		reject();
	    }
	});}
    });
}

function getPoints(URL, onEach){// onEach takes {id, user, coordinates}
    $.getJSON(URL, function(e){
	$.each(e, function(k, v){
	    v.coordinates = [v.coordinates[1], v.coordinates[0]];
	    onEach(v);
	});
    });
}

// plugin
(function ($){
    $.fn.tweetMarkers = function(URL, targetMap, options){
	var that = this;
	var markers = new L.FeatureGroup();
	var settings = $.extend({
	    markers: markers,
	    icon: L.icon({}),
	    onErrorMessage: "Error!",
	    displayMarkers: function(markers){
		targetMap.addLayer(markers);
	    }
	}, options);
	getPoints(URL, function(point){
	    var m = L.marker(point.coordinates, {icon: settings.icon});
	    settings.markers.addLayer(m);
	    m.on('click', function(){
		var promise = getTweetHtml(point.user, point.id);	
		promise.then(
		    function(html){
			that.html(html);
			// twttr.widgets.load(that);
		    },
		    function(){
			that.html(settings.onErrorMessage);
		    }
		);
	    });
	});
	settings.displayMarkers(settings.markers);
	return this.each(function(){return this;});
    };
}(jQuery));
