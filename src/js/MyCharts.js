/** 
 * 	MyCharts
 */

(function(exports) {
	class MyCharts {
		constructor() {
			this.histog = dc.barChart("#histog");
			this.rows_chart = dc.rowChart("#rows");
			this.censusData;
		}

		// drawCharts(ndx, year) {
		drawCharts(act, census) {
			let ndx = crossfilter(this.censusData['Act' + act + 'Census' + census]);
			this.drawHistogram(ndx); //, year);;		
			// console.log(" = Histog complete = ");	
			this.drawRows(ndx); //, year);
		}	

		drawHistogram(ndx) { //, year){	
			// let ratioDim 	=	ndx.dimension(function(d) { return +d["Ratio" + year]; });
			let ratioDim =
					ndx.dimension(function(d) { 
						return d['Ratio']; 
					});	

			let bin_width = 1000;
			let ratioGrp = 
					ratioDim.group(
						function(d) { 
							return Math.floor(d/bin_width)*bin_width; 
					});	
			this.histog
				// .height(255)
				.x(
					d3.scaleLinear().domain( [20000, 33000] )
				)
				.xUnits( function(){ return 13; } ) 
				.xAxisLabel("Representative ratio")
				.yAxisLabel("Count")
				.dimension(ratioDim)
				.group(ratioGrp);

			this.histog.xAxis().ticks(4);
			this.histog.yAxis().ticks(2);
			this.histog.render();
		}

		drawRows(ndx) { //, year) {
			// ratio_name_Grp	=	ratioDim.group().reduceSum(dc.pluck('ratio'));
			// var nameFunc			=   function(d){ return d.Name; };
			// var nameDim     		=   ndx.dimension( nameFunc );

			// TODO
			// trying to create chart with rows on both sides of a vertical at 30K
			// thinking to make separate chatrs for each above and below 30K
			// brushes won't work then
			// select single will work and we don't really need brushes
			// brushes are on the histogram anyway
			// but histog may not be visible
			var nameDim = ndx.dimension( (d) => { 
								let num_over_30 = 0;
								if (d['Ratio'] > 30000) {
									num_over_30++;
									return d.Constituency;
								}
								else return '';
							});

			var nameGrp = nameDim.group().reduceSum( (d) => { return d.Ratio; } );
			var ng	= 	remove_bins(nameGrp, '');
			// console.log('nameDim = ', nameDim);
			// console.log('nameGrp = ', nameGrp.all());
			// console.log('ng = ', ng.all());			

			this.rows_chart
				.height(755)
				.elasticX(false)
				.dimension(nameDim)
				.group(nameGrp);
				// .group(ng)

			this.rows_chart.x(
				d3.scaleLinear()
				.range([0, this.rows_chart.width()])
				.domain([10000, 40000])
			);
			this.rows_chart
				.xAxis()
				.scale(this.rows_chart.x())
				.tickValues([20000, 30000]);
			this.rows_chart.render();          
		}
	}

	function remove_bins(source_group) { // (source_group, bins...}
		var bins = Array.prototype.slice.call(arguments, 1);
		return { 
			all: () => { 
				return source_group
					.all()
					.filter( (d) => { 
						return bins.indexOf(d.key) === -1; 
					});
			}
		}
	}

	exports.MyCharts = MyCharts;
})( typeof exports === 'undefined' ? this['MyCharts'] = {}: exports );