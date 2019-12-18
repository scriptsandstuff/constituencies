/**
 *
 */

let mdm = new (require('./DataManager').DataManager)();

let controls = new (require('./MyControls').MyControls)();
let myLeaflet = new (require('./MyLeaflet').MyLeaflet)();

let myOverview = require('./MyOverview');
// let myTimeline = new (require('./MyTimeline').MyTimeline)().timeline;
let myTimeline = new (require('./MyTimeline').MyTimeline)();
// let MyTimeline = require('./MyTimeline').MyTimeline;
let myCharts = new (require('./MyCharts').MyCharts)();


let actYear;
let censusYears;
let censusYear;

let boundaries = {};
let geos = {};
let myStats = {};
// let myLeaflet;
// let myTimeline;

function loadOverview() {
	// myOverview.makeItADialog();
	require("../../node_modules/jquery-ui/ui/widgets/tooltip.js");
	$('#cso-chart').tooltip({
		content: 	'<img src="./dist/assets/images/CSO-chart.png" />',
		position: 	{ within: "#overview" },
	});	
	mdm.loadIntroData()
		.then( function(introData) {
			// console.log("Overview data = ", introData);
			// console.log("introData[0] = " + introData[0]);
			let el = document.getElementsByClassName("overview-chart")[0];
			myOverview.makeChart(introData, el);
		});
}

loadOverview();
// let myTimeline = new MyTimeline();
// let tl = myTimeline.timeline;

actYear = 2013;
censusYears = [2011, 2016];
censusYear = 2016;
// myLeaflet.census_year = censusYear;

// controls.displayAct = actYear;
// controls.displayCensus = censusYear;
controls.boundaries = myLeaflet.initGeos(controls.boundaries, controls);
// controls.boundaries = boundaries;
// controls.map = myLeaflet.map;
controls.setLeaf(myLeaflet);
controls.setCharts(myCharts);


// Promise.all([tlp, censusData, geoData])
Promise.all([
		mdm.loadTimelineData(),
		mdm.loadCensusData(),
		mdm.loadGeoData(actYear, censusYears)
	])
	.then( ([tlItems, censusData, geo]) => {
		myTimeline.setItems(tlItems);
		controls.initControls_Timeline(myTimeline);	

		// console.log("census data = ", vals);
		// let v = censusData['Act' + actYear + 'Census' + censusYear];
		// let ndx = crossfilter(v);
		// myCharts.drawCharts(ndx, censusYear);
		myCharts.censusData = censusData;
		// myCharts.drawCharts(actYear, censusYear);
		
		controls.boundaries[""+actYear].geo.addData(geo);


		controls.processActCensus(actYear, censusYear);
		// controls.boundaries[""+actYear].geo.addTo(myLeaflet.map);

		myLeaflet.loadAttribution();	
		// update();

		// actYear = 2009;
		// censusYears = [2006, 2011];
		// currentCensus = 2011;
		mdm.loadGeoData(2009, [2006, 2011])
			.then( (data) => {
				controls.boundaries[""+2009].geo.addData(data);
			});
	});
