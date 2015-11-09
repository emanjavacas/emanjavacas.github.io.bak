$(document).ready(function(){               
    s = null;
    g = {
	nodes: [],
	edges: []
    };
    var nodes = $.getJSON("data/wiki_nodes_coors.json");
    var edges = $.getJSON("data/wiki_edges.json");
    var addNodes = function(data, status, header){
	console.log("Got " + data.length + " nodes");
	$.each(data, function(k, v){	    
	    if (!v.x) return;	// remove undefined nodes
	    g.nodes.push(
		{id: v["id"].toString(),
		 label: v["label"],
		 x: v["x"],
		 y: v["y"],
		 gen: v["gen"],
		 color: computeColor("gen", v["gen"]),
		 gender: v["gender"]
		}
	    );
	});
    };
    var addEdges = function(data, status, header){
	console.log("Got " + data.length + " edges");
	$.each(data, function(k, v){
	    g.edges.push(
		{id: v["id"].toString(),
		 source: v["source"].toString(),
		 target: v["target"].toString(),
		 type: "curvedArrow"
		}
	    );	    
	});	
    };
    $.when(nodes, edges)
	.done(function(nodesData, edgesData){ // load nodes and edges
	    addNodes.apply(null, nodesData);
	    addEdges.apply(null, edgesData);	    
	})
	.then(function(){
	    console.log("Done!");
	    s = new sigma({	// create graph
		graph: g,
		container: "container",
		settings: {
		    scalingMode: "outside",
		    sideMargin: 0.4,
		    edgeColor: "default",
		    defaultEdgeColor: "#e5e5e5",
		    defaultEdgeType: "source",
		    defaultLabelSize: 12
		}
	    });
	    var allX = [];
	    var allY = [];
	    s.graph.nodes().forEach(function(n){
		if (n.x) allX.push(n.x);
		else allX.push(0);
		if (n.y) allY.push(n.y);
		else allY.push(0);
	    });
	    var rescaleX = rescale10(allX);
	    var rescaleY = rescale10(allY);
	    $.each(g.nodes, function(k, v){ // rescale coors to [0, 1]
	    	g.nodes[k].x = rescaleX(v.x);
	    	g.nodes[k].y = rescaleY(v.y);		
	    });

	    s.graph.nodes().forEach(function(n) {
		n.x = rescaleX(n.x);
		n.y = rescaleY(n.y);
		n.size = Math.log(s.graph.degree(n.id));
		n.degree = s.graph.degree(n.id) - 1;
		n.originalColor = n.color;
		var gens = s.graph.neighborhood(n.id).nodes.map(
		    function(n){return n.gen;}
		);
		var counts = frequencies(gens);
		var data = [];
		generations.forEach(function(k){
		    if (!counts.hasOwnProperty(k))
			data.push([k, 0]);
		    else data.push([k, counts[k]]);
		});
		$.extend(n, {"data": data});
	    });
	    s.graph.edges().forEach(function(e) {
		e.originalColor = e.color;
	    });

	    s.refresh();

	    s.bind('clickNode', function(e) {
		console.log(e.data.node.data);
		renderAuthorInfo(e.data.node,
				 {"label": "Name",
				  "gender": "Gender",
				  "gen": "Generation",
				  "degree": "Degree"
				 });		
		var toKeep = {
		    "nodes":{},
		    "edges":{}
		};
		var nodeId = e.data.node.id;
		s.graph.neighborhood(nodeId).nodes.forEach(function(n){
		    toKeep["nodes"][n.id] = n;
		});
		s.graph.neighborhood(nodeId).edges.forEach(function(e){
		    toKeep["edges"][e.id] = e;
		});
		
		s.graph.nodes().forEach(function(n) { // highlight node
		    if (toKeep["nodes"][n.id])
			n.color = n.originalColor;
		    else
			n.color = '#eee';
		});
		
		s.graph.edges().forEach(function(e) { // highlight edge
		    if (toKeep["edges"][e.id])
			e.color = "#000";
		    else
			e.color = e.originalColor;
		});
		
		s.refresh();
	    });

	    s.bind('clickStage', function(e) {
		renderAuthorInfo(
		    {"text": "Click on a node to display associated info"},
		    {"text": ""}
		);
		s.graph.nodes().forEach(function(n) {
		    n.color = n.originalColor;
		});
		
		s.graph.edges().forEach(function(e) {
		    e.color = e.originalColor;
		});
		
		s.refresh();
	    });
	});   
});
