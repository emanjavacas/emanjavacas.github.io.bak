var generations = ["0", "1", "1,5", "2", "3", "4", "4,5"];

function rescale(seq, newMin, newMax){
    var max = Math.max.apply(null, seq);
    var min = Math.min.apply(null, seq);
    return function(x){
	return (newMin * (1 - ((x - min) / (max - min))) +
	       (newMax * ((x - min) / (max - min))));
    };
};

function rescale10(seq){
    var maxVal = Math.max.apply(null, seq);
    var minVal = Math.min.apply(null, seq);
    return function(x){
	if (! x) return 0;
	return (x - minVal) / (maxVal - minVal);
    };
};

var randomColorMap = {};
var colorMap = {
    "gen": {
	"0": "#76e8b8", 
	"1": "#78d83c", 
	"2": "#d644c7", 
	"3": "#bf352d", 
	"4": "#b4ed95", 
	"4,5": "#88d7ef", 
	"2,5": "#71eda3", 
	"1,5": "#c3d14d"
    }
};

function computeColor(cat, label){
    if (colorMap[cat]) {
	return colorMap[cat][label];
    }
    if (! colorMap.hasOwnProperty(cat)) colorMap[cat] = {};
    if (! colorMap[cat].hasOwnProperty(label)){
	colorMap[cat][label] = randomColor();
    }
    return colorMap[cat][label];
};

function frequencies(obj){
    res = {};
    obj.forEach(function(k){
	if (res.hasOwnProperty(k)) res[k] += 1;
	else res[k] = 1;
    });
    return res;
}

function renderAuthorInfo(info, keys){
    $('#author-info table').empty();
    $('#author-info #gen').empty();  
    var table = $("#author-info table");//document.createElement('table');
    var tbody = document.createElement('tbody');
    Object.keys(info).forEach(function(k){
	if (!keys.hasOwnProperty(k)) return;
	var tr = document.createElement('tr');
	var kE = document.createElement('td');
	var vE = document.createElement('td');	
	kE.textContent = keys[k];
	vE.textContent = info[k];
	tr.appendChild(kE);
	tr.appendChild(vE);
	tbody.appendChild(tr);
    });
    table.append(tbody);    
    $('#author-info').prepend(table);

    if (info.data){		// render chart
	$.plot("#gen", [ info.data ], {
	    series: {
		bars: {
		    show: true,
		    barWidth: 0.6,
		    align: "center"
		}
	    },
	    xaxis: {
		mode: "categories",
		tickLength: 0
	    }
	});
    };  
}
