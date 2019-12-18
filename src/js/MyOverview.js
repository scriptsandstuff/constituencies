
// import d3Tip from 'd3-tip';

(function(exports) {
	function makeItADialog() {
		require("../../node_modules/jquery-ui/ui/widgets/dialog.js");
		$( "#overview" ).dialog({
			// autoOpen: true,
			title: 		"Proportional Representation Ireland",
			height: 	$(window).height()*0.9,
			width: 		$(window).width()*0.75,
			opacity: 	0.5,
			modal: 		true
		});
		console.log("running");
	}

	function makeChart(d, domElStr){
		let	ndx			=   crossfilter(d);		

		console.log("OV ndx = ", ndx);	
		let chart 		= 	dc.compositeChart( domElStr );

	    let dateDim		=   ndx.dimension(function(d){ return (d.date); });
		let da 			= 	dateDim.bottom(1)[0].date;
		let year 		= 	da.getFullYear();
		let month 		= 	da.getMonth();
		let day 		= 	da.getDate();
		let start 		= 	new Date(year - 1, month, day);
		let dateExtent 	=   [start, new Date()];
		
		let ratioExtent =   [10000, 46000];

		var lowGrp 		= 	dateDim.group().reduceSum(dc.pluck('lowest_ratio'));
		var natGrp 		= 	dateDim.group().reduceSum(function(d) { return d.national_ratio });
		var highGrp 	= 	dateDim.group().reduceSum(function(d) { return d.highest_ratio });

		var lowNameFunc		=   function(d){ return (d.lowest_name); }
		var highNameFunc	=   function(d){ return (d.highest_name); }

		let ttipC = 	
			d3Tip.default()
				// .attr('class', 'd3-tip')
				.attr('class', 'my-d3-tip')
				.offset([-10, 0])
				.html(
					function (d0) { 
						// console.log("key = ", d0.key);
						// console.log("date = ", d0.x);
						let line = dateDim.filter(d0.x);							
						let d = line.top(1)[0];
						// console.log("line = ", line);
						// console.log("maybe event = ", d.event);

						return '<h5>' + d.event + '</h5>' +
							'<TABLE> <TH> ' +
							'<td>Ratio</td> <td>Population</td> <td>TDs</td> </TH>'+
								'<TR> <TD>' + d.highest_name + '</TD>' +
								'<TD>' + d.highest_ratio + '</TD>' +
								'<TD>' + d.highest_pop + '</TD>' +
								'<TD>' + d.highest_tds + '</TD></TR>' +
								'<TR><TD>Ireland</TD>' + 
								'<TD>' + d.national_ratio + '</TD>' +
								'<TD>' + d.national_pop + '</TD>' +
								'<TD>' + d.national_tds + '</TD></TR>' +
								'<TR> <TD>' + d.lowest_name + '</TD>' +
								'<TD>' + d.lowest_ratio + '</TD>' +
								'<TD>' + d.lowest_pop + '</TD>' +
								'<TD>' + d.lowest_tds + '</TD></TR>' +
							'</TABLE>';								
				});
		
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		// w = w-36;
		chart
			// .height(200)
			// .width(w-36)
			.x(d3.scaleTime().domain(dateExtent))
			.y(d3.scaleLinear().domain(ratioExtent))
			// .xAxisLabel("Date")			
			.yAxisLabel("Representative ratio")
			.margins({top: 0, right: 0, bottom: 42, left: 56})
			// BOGUS
			// what the hell are these numbers doing here???
			// 42 was the default calculated, 56 by trial and error
			.yAxisPadding(20)
			.legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
			.title(function() { return ""; }) // oh you can not add HTML to TITLE
			.on('renderlet', function(chart) { 
				chart.selectAll('circle')
					.call(function(d) { ttipC(d) })
					.on('mouseover', function(d) { ttipC.show(d, this) })
					.on('mouseout',  function(d) { ttipC.hide(d, this); });
					// BOGUS
					// must hide the vertical and horizontal dashed lines
				// chart.selectAll('y-axis-label')
				// 	.call(function(d) {});
			})			
			.compose([
				dc.lineChart(chart)
					.group(lowGrp, 'lowest ratio')
					.dashStyle([5,5])
					.renderDataPoints({
						radius: 3,
						fillOpacity: 0.8,
						strokeOpacity: 0.8,
					})
				,
				dc.lineChart(chart)
					.group(natGrp, 'nationwide ratio')
					.renderDataPoints({
						radius: 3,
						fillOpacity: 0.8,
						strokeOpacity: 0.8,
					})
				,
				dc.lineChart(chart)
					.group(highGrp, 'highest ratio')
					.dashStyle([1, 2, 1])
					.renderDataPoints({
						radius: 3,
						fillOpacity: 0.8,
						strokeOpacity: 0.8,
					})
			])				
			.brushOn(false) // points wont render with brush on
			.render();	
	}
	
	exports.makeChart = makeChart;
	// exports.makeIntroDialog = makeIntroDialog;
})( typeof exports === 'undefined' ? this['MyOverview'] = {}: exports );
