/**
 * 	MyControls.js
 */

(function(exports) { class MyControls{
	constructor() {
		this.tlControls;
		this.boundaries =
		 	{ 	'2013': { 'census': [2011, 2016], 'displayCensus': 2016 }, 
				'2009': { 'census': [2006, 2011], 'displayCensus': 2011 }
			};
		this.displayAct;
		this.displayCensus;
		this.myleaf;
		this.mycharts;
		this.featureControls = {
			"over": this.featureOver,
			'out': this.featureOut,
			'click': this.featureClick
		}
	}
	setLeaf(leaf) { this.myleaf = leaf; }
	setCharts(charts) { this.mycharts = charts; }
	getDisplayCensus() { return this.displayCensus; }

	makeTlBorder(act, census) {	
		let divs = document.querySelectorAll('.tl-selected');
		divs.forEach( function(el) {
			// console.log('el =' + el);
			el.classList.remove('tl-selected');
			el.style.border = "none";
			el.style.borderImage = "none";

		});
		let s1 = '.enacted-act'+act+'-census'+census;
		let s2 = '.effected-act'+act+'-census'+census;
		divs = [document.querySelectorAll(s1)[0],
					document.querySelectorAll(s2)[0]];
		// console.log(s1);
		// console.log(s2);
		// console.log(divs);
		divs.forEach( function(el) {
			// console.log('el =' + el);
			el.classList.add('tl-selected');
		});

		require('./magicBorder').makeBorder(divs, 4, 'white');
	}

	processActCensus(act, census) {
		let noData 				 = 	act == 2017,
			displayNewBoundaries = 	this.boundaries[""+act] && act != this.displayAct,
			displayNewCensus	 =	this.boundaries[""+act] && act == this.displayAct,
			displayNewCharts	 =	!this.boundaries[""+act] && 
										(act != this.displayAct || 
											census != this.displayCensus);

		if(noData) {
			// console.log('NO DATA = ');
			this.updateActCensusInfo(act, census);
			return;
		}															
		if(displayNewBoundaries) {
			// console.log('New act = ', act);
			this.updateBoundaries(act, census);
			this.updatePopulation(act, census);
			this.myleaf.displayGeo.addTo(this.myleaf.map);
			this.mycharts.drawCharts(act, census);
			this.updateActCensusInfo(act, census);
			// this.displayAct = act;
			return;
		}
		if (displayNewCensus) {
			// console.log('Same Act was clicked  ===  boundaries available');
			// console.log('New census year = ', census);
			this.updatePopulation(act, census);
			this.myleaf.displayGeo.addTo(this.myleaf.map);
			this.mycharts.drawCharts(act, census);
			this.updateActCensusInfo(act, census);
			return;
		}
		if (displayNewCharts) {
			// console.log('USE -CENSUS- -NOT GEO- DATA HERE');
			// console.log('Need another condition to exclude the latest census');
			this.mycharts.drawCharts(act, census);
			this.updateActCensusInfo(act, census);
			return;
		}
		if (!(act == this.displayAct && census == this.displayCensus)) {
			// console.log('Same Act and Census were clicked');
		// } else {
			console.log("DON't KNOW HOW THIS HAPPENED");
		}
		console.log('Act = ', act, 'Census = ', census);
		
	}

	initControls_Timeline(mytl, myLeaf) {	
		mytl.timeline.on('click', (e) => { 
			let act, census;
			// console.log('myTimeline = ', mytl);
			if (e.item == null) {
				
				[act, census] = mytl.processBackgroundClick(e); 

				if (act) {
					this.processActCensus(act, census);
				} else {	
					// console.log('a null item -- NON-BG -- item was clicked');			
					this.noBoundaries(); 
				}
			} else {
				console.log('an item was clicked');		
				this.noBoundaries(); 
			}
		});
		/*
			tl.on('rangechange', function (properties) {
				// console.log('timeline range changed!!');
				// console.log('props = ', properties);
				var t = tlFun.getCentreDate(properties);
				if (!tlFun.isSameInterval(t)) 
					myTimeline.rangeChanged = true;
			});

			tl.on('mouseDown', function (p) {
				// console.log('mouseDown on timeline!!');
				myTimeline.rangeChanged = false;
			});
		*/
	}

	updateBoundaries(act, census) {
		// console.log("this.boundaries = ", this.boundaries);
		if ( this.boundaries[""+act] ) {
			// details.fillDetail(geos[""+act].stats, act, census);
			this.myleaf.map.removeLayer(this.myleaf.displayGeo);

			this.myleaf.displayGeo = this.boundaries[""+act].geo;	
			
			this.displayAct = act;
			return true;
		} else {
			this.noBoundaries();
			return false;
		}
	}
	
	updatePopulation(act, census) {
		// console.log("updatePopulation, censusYear = ", census);
		this.displayCensus = census;
		this.myleaf.displayGeo.eachLayer(function(layer) {				
			var r = layer.feature.properties['rr' + census];
			let color = require('./MyChromaKey').getColor(r/1000);
			layer.setStyle({
				fillColor: color //'#555555'
			});
		});	
		this.displayCensus = census;
		return;
	}

	geoStyle(feature, censusYear) {
		let style = style_default;
		if (censusYear) {
			console.log("census = ", censusYear);			
			var ratio = feature.properties['rr'+censusYear]/1000;
			console.log("ratio = ", ratio);
			style['fillColor'] = require('./MyChromaKey').getColor(ratio);
		}
		return style;
	}

	geoFeatureControls(layer) { //geojson, layer) {
		// onEachFeature(feature, layer, map, mgl) {
		layer.on({
			mouseover: 	(e) => { return this.featureOver(e, layer) },
			mouseout: 	(e) => { return this.featureOut(e, layer) },
			// click: 		function(e) {return featureClick(e)}
		});
	}
	
	featureOut(e, layer) {
		var target = e.target;
		// these styles are in MyConfig!!!
		target.setStyle(style_default);
		// 
		this.updateFeatureInfo( null, this.displayCensus );
	}

	featureOver(e, layer) {
		var target = e.target;
		// these styles are in MyConfig!!!
		target.setStyle(style_highlight);
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			target.bringToFront();
		}
		let props = target.feature.properties;
		this.updateFeatureInfo( props, this.displayCensus );
		// console.log("updatePopulation, censusYear = ", census)
		// showFeatureOnHistog();
		// showFeatureOnRows();
	}

	featureClick(e, map) {
		// might be nice to return to zoom whole island if next click is on same feature...
		map.fitBounds(e.target.getBounds());
	}

	updateActCensusInfo(actYear, censusYear) {
		let div  = $('.actCensusInfo')[0];
		div.innerHTML = '<h4>Act: ' + actYear + ' | Census: ' + censusYear + '</h4>';
		if (!this.boundaries[""+actYear]){ div.innerHTML += '<h4>Boundaries not available.</h4>';}
		// if (!censusYear){ div.innerHTML += '<h4>Census data not available.</h4>';}
		this.makeTlBorder(actYear, censusYear);
	}

	updateFeatureInfo(props, census_year) {		
		let featureInfoDIV  = $('.featureInfo')[0];
		featureInfoDIV.innerHTML = '<h4>Representative Ratio</h4>';
		// BOGUS
		// want to put the national ratio in here too
		if (props){
			let r = props['rr' + census_year];
			featureInfoDIV.innerHTML += 
				'<b>' + props.name + ': </b><div id="ratio">' + r + '</div><br />' + // people / TD
				'Population: 			<div id="pop">' + 		props['pop' + census_year] 	+ '</div><br />' +
				'TDs: 		 			<div id="tds">' +		props['no_tds'] 			+ '</div><br />';
		} else {
			featureInfoDIV.innerHTML += 'Hover over a constituency';
		}
	}

	noBoundaries() {
		// alert("Sorry.\nThe bourdary data for the requested act are unavailable");
		console.log('NO BOUNDARIES!!');
		this.myleaf.map.removeLayer(this.myleaf.displayGeo);
	}

	fillDetail(ndx, act, census) {
		$('#selected-act').text(act);
		$('#selected-census').text(census);
		console.log(ndx);
		console.log(ndx[0]);
	}

}
exports.MyControls = MyControls;
})( typeof exports === 'undefined' ? this['MyControls'] = {}: exports );