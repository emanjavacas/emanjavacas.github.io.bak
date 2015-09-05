var kiez = function(){
    var cachedTweets = {};
    var buildOpts = function(opts){
	return Object.keys(opts).reduce(function(acc, k){
	    return acc + k + "=" + opts[k] + "&";
	}, "&");
    };
    var buildOEmbed = function(user, tweet, opts){
	var path = "https://api.twitter.com/1/statuses/oembed.json?url=https://twitter.com/";
	return path + user + "/status/" + tweet + buildOpts(opts || {});
    };
    var getTweetHtml = function(user, tweet){// return a promise
	return new Promise(function(resolve, reject){
	    if (cachedTweets[user+tweet]) resolve(cachedTweets[user+tweet]);	
	    else {
		var req = new XMLHttpRequest();
		req.open('GET', buildOEmbed(user, tweet, {omit_script: "true"}));
		req.onload = function(){
		    if (req.status == 200 ) {
			var html = $.parseJSON(req.response)['html'];
			cachedTweets[user+tweet] = html;
			resolve(html);
		    } else reject(Error(req.status));
		};
		req.onerror = function(){reject(Error("Network Error"));};
		req.send();	
	    }
	});
    };
    return {
	getPoints: function(URL, onEach){// onEach takes {id, user, coordinates}
	    $.getJSON(URL, function(e){
		$.each(e, function(k, v){
		    v.coordinates = [v.coordinates[1], v.coordinates[0]];
		    onEach(v);
		});
	    });
	},
	getTweetHtml: getTweetHtml
    };
}();
