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
	getPoints: function(onEach){// onEach takes {id, user, coordinates}
	    $.getJSON('data/kiez.min.json', function(e){
		$.each(e, function(k, v){
		    onEach(v);
		});
	    });
	},
	getTweetHtml: getTweetHtml
    };
}();


// kiez.getPoints(
//     function(obj){
// 	kiez.getTweetHtml(obj['user'], obj['id'])
// 	    .then(
// 		function(e){
// 		    $(e['html']).appendTo('.main');
// 		});
//     });
