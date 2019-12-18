/**
 * 	loadCensusData.test.js
 * 		@author marcd 2019-07-14
 */
let fs = require('fs');
// require('../node_modules/d3-dsv/dist/d3-dsv.js');
global.d3 = require('../node_modules/d3/dist/d3.js');
// global.fetch = require('../node_modules/node-fetch/lib/index.js');

let mdm = new (require('../src/js/DataManager').DataManager)();
// let mdm = new dm.DataManager();

global.fetch = function(fileStr) {
	console.log("FETCHING");
	let d = fs.readFileSync(fileStr, 'utf8', function (err, data) {
		if(data) {
			console.log("Reading File");
		} else {
			console.log("READ ERROR = ", err);
		}
		return data;
	});
	return d;
}

d3.csv = async function(fileStr) {
	let d = fetch(fileStr);
	d = d3.csvParse(d);
	return d;
}


d3.JSON = async function(fileStr) {
	let d = fetch(fileStr);
	// d = d3.csvParse(d);
	
	return d;
}
let censusData = mdm.loadCensusData();
// let tld = loadTimeline();
censusData.then( (censusData) => {
	// console.log("censusData = ", censusData);
	console.log("censusData[0] = ", censusData[0]);
	// console.log("censusData KEYS = ", d3.keys(censusData[0]));
	console.log("census done = ");
});






// let myStats = {};

// let actYear;
// let censusYears;
// let currentYear;

// function update() {
// 	myGeoData[""+actYear] = mdm.loadGeoData(actYear, censusYears, currentYear);
	
// 	myGeoData[""+actYear].then((data) => {

// 		myGeos[""+actYear] = new myGeo(actYear, censusYears, currentYear, data);
		
// 		// myGeos[""+act].setCensusYear(census);
// 		// myGeos[""+act].getGeoLayer().addTo(myLeaflet.map);
// 		myLeaflet.layer_geo_current = myGeos[""+actYear].getGeoLayer();	
// 		myLeaflet.layer_geo_current.addTo(myLeaflet.map);

// 		myStats[""+actYear] = myGeos[""+actYear].getStats();
// 		// let stats = myGeos[""+actYear].getStats();
// 		// console.log("stats = " + stats);
// 		// console.log("mc = " + mc);

// 		// mc.drawHistogram(myStats[""+actYear], currentYear);
// 		// mc.drawRows(myStats[""+actYear], currentYear);
// 		// mc.drawCharts(myStats[""+actYear], currentYear);

// 		// let details = require('./utils_detail');
// 		// details.fillDetail(myGeos[actYear].stats, actYear, currentYear);

// 		// // myLeaflet.layer_geo_current.clearLayers();
// 		// myLeaflet.map.removeLayer(myLeaflet.layer_geo_current);
// 		// // myLeaflet.layer_geo_current = {};
		

// 		// this.loadedGeos.append(actYear);
// 		// return stats;			


// 		// let actYear = 2013;
// 		// let censusYears = [2011, 2016];
// 		// let currentYear = 2016;
// 		// utils.updateBoundaries(myLeaflet, myGeos, actYear, currentYear);
// 	});
// 	// currentYear = 2011;
// 	// utils.updatePopulation(myLeaflet, myGeos[""+actYear], currentYear);
// }

// actYear = 2013;
// censusYears = [2011, 2016];
// currentYear = 2016;
// function loadCensus() {

// 	let fileUrl = require('file-url');
// 	let fileStr = fileUrl('./dist/assets/data/census-all.js'); //, {resolve: false});
// 	console.log("fileStr = ", fileStr);
// 	let cd = mdm.loadCensusData(fileStr);
// 	// cd.then(function(d) {
// 	// 	console.log("loaded = ", cd);
// 	// })	
// 	// return cd;
// }
// loadCensus();

// // // https://grokbase.com/t/gg/d3-js/13455qtpph/d3-csv-on-node
// // fs.readFile('./prevelance.csv', 'utf8', function (err, data) {
// // d3.csv.parse(data);
// // })



// // update();


// 	// actYear = 2009;
// 	// censusYears = [2006, 2011];
// 	// currentYear = 2011;

// 	// myGeos[""+actYear] = new myGeo(actYear, censusYears, currentYear);
// 	// // utils.updateBoundaries(myLeaflet, myGeos, actYear, currentYear);
// 	// // 	currentYear = 2006;
// 	// // 	utils.updatePopulation(myLeaflet, myGeos[""+actYear], currentYear);

// 	// // myLeaflet.layers_geo = {2013: myLeaflet.layer_geo_current};
		
// 	// var event_detail = document.getElementById('event_detail');



// 	// // createViews();
// 	// let views = new Views();
// 	// // createControls();
// 	// let controls = new Controls();

// 	// // we can think about using cookies here
// 	// controls.init();

// 	// // views = 
// 	// views.update(data, controls.settings);
// 	// // controls = 
// 	// controls.update(views);
// // init();
// // $(document).ready(function() {
// // 	init();
// // });

// // });