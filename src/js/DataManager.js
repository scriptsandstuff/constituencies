/**
 * MyData.js
 */

(function(exports) {
	class DataManager {
		constructor() {
			this.introData = {};

			this.tlData = {};
			this.actCensus = {};
			// this.censusData = {};
			this.geoData = {};
			// this.loadIntroData: loadIntroData;
		}

		startsWith(array, key) {
			// console.log("startsWith - ARRAY = ", array);

			const matcher = new RegExp(`${key}`, 'g');
			// console.log("matcher = ", matcher);
			// console.log("match[0] = ", array.match(matcher));
			
			return array.filter(word => word.match(matcher));
		}

		async loadMainData(actYear) {
			return Promise.all([loadTimelineData(), loadCensusData(), loadGeoData(actYear)]);
		}

		async loadIntroData() {
			function formatIntroData(d) {		
				let parseDate = d3.timeParse("%Y,\ %m,\ %d");//.parse;
				d.forEach(function(d) {
					d.date				=	parseDate(d.date);
					d.national_pop		=	+d.national_pop;
					//	 d.tds_high		=   x.  // tds_high;
					//	 d.tds_low		=   x.  // tds_low;
					d.national_tds		=	+d.national_tds;	
					d.national_ratio	=	+d.national_ratio;

					d.lowest_pop		=   +d.lowest_pop;
					d.lowest_tds		=   +d.lowest_tds;
					d.lowest_ratio		=	+d.lowest_ratio;

					d.highest_pop		=   +d.highest_pop;
					d.highest_tds		=   +d.highest_tds;
					d.highest_ratio		=	+d.highest_ratio;
				});
				return d;
			}

			let data = await d3.csv(overviewFileStr)
				.then(function (data) {
					data = formatIntroData(data);
					return data;
				});
			return data;
		}

		async loadTimelineData() {
			//Really should make the TL data json too

			function formatTlData(data) {
				// console.log("data = \n", data);
				let parseDate = d3.timeParse("%Y,\ %m,\ %d");
				// let parseDate = d3.timeParse("%Y(,\ ?%m)?(,\ ?%d)?");
				//.parse; must see about some regular expression for this
				// console.log("FORMATTING\nd = \n", data);
				data.forEach((d) => {
					d.group = +d.group;
					// d.type;
					d.start = parseDate(d.start);
					if (d.className != 'act') {
						if(d.end) {
							d.end = parseDate(d.end);
						} else { // if (d.type && d.type in ['range', 'background']) {
							d.end = new Date();
						}
					}
					if ( ( d.className ) && 
							( d.className.match(new RegExp('effected.*')) || 
						 	  d.className.match(new RegExp('enacted.*')))) {
						d.act 		= +d.act;
						d.census 	= +d.census;
						if ( d.className.match(new RegExp('effected.*')) ) {
							// d["id"] = "effected-act" + d.act + "-census" + d.census;
							d.className += " effected-act" + d.act + "-census" + d.census;
						} else {
							// d["id"] = "enacted-act" + d.act + "-census" + d.census;
							d.className += " enacted-act" + d.act + "-census" + d.census;
						}
					} else {
						d.subgroup 	= d.className;
					}
					return d;
				});
				return data;
			}	

			let data = await d3.csv(timelineFileStr) //"./dist/assets/data/tl-all.csv")
				.then(function (data) {
					data = formatTlData(data);

					return data;
				});
			// this.tlData = data;
			return data;
		}

		async loadCensusData() {
			// let response = await fetch("./dist/assets/data/actcensus.json");
			// const myJson = await response.json();
			let data = await 
				d3.json("./dist/assets/data/actcensus1.json")
				// $.getJSON("./dist/assets/data/actcensus.json")
				.then(function (d) {
					return d;
				});
			return data;
		}

		async loadGeoData(actYear, censusYears) {
			/*
				I think I get the XML parsing error even when it does load
				Why do I use $.getJSON and not leaflet.geoJSON
			*/
			let fileStr = geoFileStr(actYear, censusYears);
			let data = await $.getJSON(fileStr)
				.then( function(data) {
					if(data) {
						console.log("got GEO");
						return data;
					} else {
						console.log("no loading of Geo????");
					}
				});
			return data;
		}
	}

	exports.DataManager = DataManager;

})( typeof exports === 'undefined' ? this['DataManager'] = {}: exports );