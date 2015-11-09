var diversity = function(){
    var identity = function(x){	return x; };
    var summation = function(vals, fn){
	var fun = fn || identity;
	var result = 0;
	for (var i = vals.length; i--;) result += fun(vals[i]);
	return result;
    };
    var formula = function(counts, a){	
	var base = summation(counts, function(x){return Math.pow(x, a);});
	return Math.pow(base, 1 - (1 - a));
    };
    var hillNums = function(counts, a){
	if (a == 1){
	    var base = -summation(count, function(x){return x * Math.log(x);});
	    return Math.exp(base);
	}
	return formula(counts, a);
    };

    // legacy
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
    return {
	hill: hill
    };
}();
