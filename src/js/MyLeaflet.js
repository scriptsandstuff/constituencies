/**
*
*/
(function(exports) { class MyLeaflet { // extends leaflet
	constructor(elemStr) {	
		// leaflet uses the function name 'control' for any DIV that appears on the map
		// the color ledgend for example is a leaflet control but never changes and controls nothing
		// the hover info contros nothing but does update
		// the geo layer controls the hover but is not a leaflet control
		
		let zoomProps = { maxZoom: 14, minZoom:6, zoomControl: false };
		this.map = L.map('IE_map', zoomProps).setView([53.45, -12.8], 7);


		// BOGUS 
		// mapbox now using cookies
		// this.loadTiles();


		this.displayGeo = L.geoJson(null);
		this.displayGeo.addTo(this.map);

		// census_year is required by the styleLayer(feature) function
		// ...it can not be passed as a param
		// this.census_year;
		// this.act_year;




		this.ledg_colors = L.control({position: 'bottomright'});
		this.actCensusInfo = L.control({position: 'topright'}); // Year of Act and Census
		this.featureInfo = L.control(); 	// constituency info on hover		
		this.tlControl = L.control({position: 'topleft'}); 
		this.overviewControl = L.control({position: 'topleft'}); 
		this.chartsControl = L.control({position: 'topleft'}); 
		this.histogControl = L.control({position: 'topleft'}); 
		this.rowsControl = L.control({position: 'topleft'}); 
		
		this.initControls();	
		// utilsm.updateFeatureInfo(null, null);			
	}

	initControls() {
		// let thisLeaf = function(){ return this; };
		let thisLeaf = this;

		/**
		 *
		 */
		this.ledg_colors.onAdd = function(map) { 				
			// // I feel I should be using the map arg
			// console.log('map = ', map);
			// TODO
			// it is maybe possible to use an arrow function here to maintain 
			// this and not pass thisLeaf
			this._div = L.DomUtil.create('div', 'legend-colors');
			// this._div.innerHTML = thisLeaf.getColorsContent();		
			this._div.innerHTML = require('./MyChromaKey').getChromaLedgend();
			return this._div;
		}

		/**
		 *
		 */
		this.actCensusInfo.onAdd = function(map) {
			// this._div = $('#selected-info')[0];
			this._div = L.DomUtil.create('div', 'legend map_legend actCensusInfo');
			return this._div;
		}

		/**
		 *
		 */
		this.featureInfo.onAdd = function(map) {
			this._div = L.DomUtil.create('div', 'legend map_legend featureInfo');
			return this._div;
		}

		/**
		 *
		 */
		this.tlControl.onAdd = function(map) { 
			// 
			this._div = L.DomUtil.create('div', 'legend map_legend main-control');
			let tlc = L.DomUtil.create('div', 'timeline-container');
			this._div.appendChild(tlc);
		
			this._div.addEventListener('mouseover', () => { 
				map.dragging.disable();
				map.scrollWheelZoom.disable();

			});
			this._div.addEventListener('mouseout', () => { 
				map.dragging.enable(); 
				map.scrollWheelZoom.enable();
			});
			let theDiv = $( this._div );

			// BOGUS
			// should include jq-ui.css to show the expansion icon in the corner
			// 
			// definitely should set a cookie to remember the size of this element
			require( ["jquery", "../../node_modules/jquery-ui/ui/widgets/resizable"], 
				( $ ) => {
					theDiv.resizable({
						handles: 'se',
						// resize: debounce(
						// 	function( event, ui ) {
						// 		new magic.makeBorder([top1, bot1], 20, 'red');
					});
			});
			return this._div;
		}

		this.chartsControl.onAdd = function(map) { 
			this._div = L.DomUtil.create('div', 'legend map_legend charts-control');

			let charts 	= L.DomUtil.create('div', 'charts');
			// we need an id for dc.chart('#id')
			charts.id 	= 'charts';	

			let histog 	= L.DomUtil.create('div', 'histog');
			let rows 	= L.DomUtil.create('div', 'rows');
			// let detail 	= L.DomUtil.create('div', 'detail');
			histog.id 	= 'histog';
			rows.id 	= 'rows';
			// detail.id 	= 'detail';
			// let theDiv = $( histog );
			require( ["jquery", "../../node_modules/jquery-ui/ui/widgets/resizable"], 
				( $ ) => { 
					// $( histog ).resizable({ handles: 'se' });
					// $( rows ).resizable({ handles: 'se' });
					$( charts ).resizable({ handles: 'se' });
				});
			this._div.appendChild(histog);
			this._div.appendChild(rows);
			// this._div.appendChild(detail);
			// this._div.addEventListener("mousedown", e => e.stopPropagation());
			this._div.addEventListener('mouseover', () => { 
				map.dragging.disable();
				map.scrollWheelZoom.disable();

			});
			this._div.addEventListener('mouseout', () => { 
				map.dragging.enable(); 
				map.scrollWheelZoom.enable();
			});

			return this._div;
		}

		this.histogControl.onAdd = function(map) { 
			this._div = L.DomUtil.create('div', 'legend map_legend histog-control');

			let histog 	= L.DomUtil.create('div', 'histog');
			// we need an id for dc.chart('#id')
			histog.id 	= 'histog';	

			this._div.appendChild(histog);
			// this._div.addEventListener("mousedown", e => e.stopPropagation());
			this._div.addEventListener('mouseover', () => { map.dragging.disable(); });
			this._div.addEventListener('mouseout', () => { map.dragging.enable(); });
			return this._div;
		}

		/**
		 *
		 */
		this.rowsControl.onAdd = function(map) { 
			this._div = L.DomUtil.create('div', 'legend map_legend rows-control');

			let rows 	= L.DomUtil.create('div', 'rows');
			// let detail 	= L.DomUtil.create('div', 'detail');
			// we need an id for dc.chart('#id')
			rows.id 	= 'rows';
			// detail.id 	= 'detail';

			this._div.appendChild(rows);
			// this._div.appendChild(detail);
			// this._div.addEventListener("mousedown", e => e.stopPropagation());
			this._div.addEventListener('mouseover', () => { map.dragging.disable(); });
			this._div.addEventListener('mouseout', () => { map.dragging.enable(); });
			return this._div;
		}

		/**
		 *
		 */
		this.overviewControl.onAdd = function(map) { 
			this._div = L.DomUtil.create('div', 'legend map_legend overview-control is-control');
			this._div.id = 'overview-control';
			// let overviewDetail = $('#overview')[0];
			// overviewDetail.classList.toggle("is-control");
			// this._div.appendChild(overviewDetail);
		
			this._div.addEventListener('mouseover', () => { 
				map.dragging.disable();
				map.scrollWheelZoom.disable();

			});
			this._div.addEventListener('mouseout', () => { 
				map.dragging.enable(); 
				map.scrollWheelZoom.enable();
			});

			let theDiv = $( this._div );
			require( ["jquery", "../../node_modules/jquery-ui/ui/widgets/resizable"], 
				( $ ) => { theDiv.resizable({ handles: 'se' });
			});
			let overviewChart = L.DomUtil.create('div', 'overview-chart');
			this._div.appendChild(overviewChart);

			return this._div;
		}

		this.ledg_colors.addTo(this.map);
		L.control.zoom({ position: 'bottomright' }).addTo(this.map);
		this.actCensusInfo.addTo(this.map);	
		this.featureInfo.addTo(this.map);

		this.tlControl.addTo(this.map);	
		this.overviewControl.addTo(this.map);
		this.chartsControl.addTo(this.map);	
		// this.histogControl.addTo(this.map);	
		// this.rowsControl.addTo(this.map);	
		// we're going to have a static chart for the NOSCRIPT case
		// so we will have to remove that node when attaching the dynamic chart
	}

	loadTiles(){	
		console.log("loadTiles() was called!!");
		let mapboxAccessToken = 
			'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
		let url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=';
		L.tileLayer( url + mapboxAccessToken, {id: 'mapbox.light'}).addTo(this.map);
		this.map.attributionControl.addAttribution('Imagery © <a href="http://mapbox.com">Mapbox</a>');
	}

	loadAttribution(){
		this.map.attributionControl.addAttribution('Boundary data &copy; <a href="http://www.osi.ie">OSi</a>');
		this.map.attributionControl.addAttribution('Population data &copy; <a href="http://www.cso.ie/en/index.html">CSO</a>');
	}

	

	initGeos(geos, controls) {
		// this.getColor = controls.getColor;
		
		for (let act in geos) {
			// controls.displayCensus = geos[act].census[1];
			// let prop = 
			// console.log("prop = ", prop())
			 // function() {return 'rr'+controls.displayCensus;}); },					
			geos[act]['geo'] = L.geoJson( null, {
				style: function(feature) { return style_default; },
				// style: function(feature) {
				// 	// return this.styleDefault(feature);
				// 	var ratio = feature.properties['rr' + controls.displayCensus]/1000;
				// 	return {
				// 		weight: 2,
				// 		opacity: 1,
				// 		color: 'white',
				// 		dashArray: '3',
				// 		fillOpacity: 0.6,
				// 		fillColor: 
				// 				(ratio) => 	{ return controls.getColor(ratio) }
				// 			 			// ratio >= 30 ? 	'blue' :
				// 			 			// ratio > 20 	? 	'green' :
				// 			 			// 			'#8b0000'
				// 				// }
				// 	};
				// },
				onEachFeature: function(feature, layer) {
					// 	return this.onEachFeature(feature, layer, map, mgl);
					// return onEveryFeature(layer); 
					// return onEachFeature(layer, featureControls); 
					layer.on({
						mouseover: 	(e) => { return controls.featureOver(e, layer) },
						mouseout: 	(e) => { return controls.featureOut(e, layer) },
						// click: 		function(e) {return featureClick(e)}
					});
				}
				// onEachFeature: function(feature, layer, map) {
				// 	return this.onEachFeature(feature, layer, map, mgl);
				// 	// return controls.featureControls(feature, layer, map, mgl);
			});
		}
		// return geoLayer;
		return geos;
	}

	onEachFeature(layer, featureControls) {			
		layer.on({
			mouseover: 	(e) => { return featureControls.over(e, layer) },
			mouseout: 	(e) => { return featureControls.out(e, layer) },
			// click: 		function(e) {return featureClick(e)}
		});
	}
}
exports.MyLeaflet = MyLeaflet;
})( typeof exports === 'undefined' ? this['MyLeaflet'] = {}: exports );