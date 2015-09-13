var chartD3 = function(){
    var init = {};
    var padding = 50;
    var width = $('.chart').width(),
    height = $('.chart').height(),
    x = d3.scale.linear()
	.range([0, width - padding]),
    y = d3.scale.linear()
	.range([0, 1]);   
    
    var chart = d3.select('.chart')
	.append('svg')
	.attr('width', width)
	.attr('height', height);
    var back = chart.append('rect')
	.attr('class', 'background')
	.attr('width', '100%')
	.attr('height', '100%')
	.style('fill', '#f5f5f5');

	chart.append('g')
	    .attr('class', 'axis')
	    .attr('transform', 'translate(10,' + ( height - 20 ) + ')');
    
    var draw = function(data){
	var sorted = data.sort(function(a,b){
	    return d3.descending(a.value,b.value);
	}).slice(0, 12);
	var barHeight = (height - padding - padding) / sorted.length;
	x.domain([0, d3.max(data, function(d){return d.value;})]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient('bottom')
	    .ticks(3);

	// enter
	chart.selectAll('.bar')
	    .data(sorted, function(d){return d.key;})
	    .enter()
	      .append('g')
	        .attr('class', 'bar')
	        .attr('transform', function(d, i){
		    return 'translate(10,' + (i * barHeight + 20) + ')';
		})
	        .style('fill-opacity', 0.2)
	        .each(function(d, i){
		    d3.select(this)
			.append('text')
     			  .attr('x', width - 20)
			  .attr('y', barHeight / 2)
			  .attr('dy', '.35em')
			  .text(function(d){return d.key;});		    
		    d3.select(this)
			.append('rect')
                           .attr('width', function(d, i){return x(d.value);})
    			   .attr('height', barHeight - 5)
			.on('mouseout', function(){			       
			    d3.select(this)
				.transition().duration(250)
				.style('fill', '#337ab7');			       
			})
    			.on('mouseover', function(){
			    d3.select(this)
				.style('fill', 'orange');			       
			});
		});
	
	// update
	chart.selectAll('.bar')
	    .data(sorted, function(d){return d.key;})
  	      .transition().duration(1000)
	      .attr('transform', function(d, i){
		  return 'translate(10,' + (i * barHeight + 20) + ')';
	      })
 	      .style('fill-opacity', 1)
	      .each(function(d, i){
		  d3.select(this)
		      .select('rect')
		      .attr('width', function(d, i){return x(d.value);})
		      .attr('height', barHeight - 5)
		      .on('click', function(){
			  var node = d3.selectAll('.bar text').filter(function(dd){
			      return dd.key == d.key;
			  });
			  if (node.classed('selected')) {
			      node.transition().ease('circle').text(d.key);   
			  }
			  else node.transition().ease('circle').text(d.value);
			  node.classed('selected', !node.classed('selected'));
		      });
		  d3.select(this)
		      .select('text')
		      .attr('y', barHeight / 2)
		      .text(function(d){return d.key;});		
	      });
	chart.select('.axis')
	    .transition().duration(1000)
	    .call(xAxis);

	// exit
	chart.selectAll('.bar')
	    .data(sorted, function(d){return d.key;})
	    .exit()
	       .transition().duration(1000)
	       .attr('transform', function(d, i){
		   return 'translate(10'+ (i * barHeight + height) +')';
	       })
	       .style('fill-opacity', 0)
	       .remove();
    };

    return {
	draw: draw,
	redraw: function(){
	    console.log('a');
	}
    };
}();

