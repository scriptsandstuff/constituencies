
/**
 * 	loadTlData.test.js
 * 		@author marcd 2019-11-28
 */
let fs = require('fs');
global.d3 = require('../node_modules/d3/dist/d3.js');
// global.d3 = require('d3.js');
// require('../node_modules/d3-dsv/dist/d3-dsv.js');
vis = require('../node_modules/vis/dist/vis.js');

let dm = require('../src/js/DataManager');

// global.fetch = require('../node_modules/node-fetch/lib/index.js');
global.fetch = function(fileStr) {
	console.log("FETCHING");
	let d = fs.readFileSync(fileStr, 'utf8', function (err, data) {
			// try {
			// 	console.log("Reading File");
			// } catch (e) {
			// 	console.error(err.message);
			// }
		if(data) {
			console.log("Reading File");
			// console.log("File data = ", data);
		} else {
			console.log("READ ERROR = ", err);
		}
		return data;
	});
	return d;
}
d3.csv = async function(fileStr) {
	// 
	// why is it not promises being sent back???
	// 
	
	let d = fetch(fileStr);
	d = d3.csvParse(d);
	return d;
	// fs.readFilesync(fileStr, 'utf8', 
	// 	(err, data) => {
	// 		console.log(" == MY TEST -> d3.csv -> fs.ReadFile -> ()=> == ");
	// 		try {
	// 			if (!err) {
	// 				// try {
	// 				// 		// data.then((data) => {
	// 					// data = d3.csvParse(data);
	// 					console.log("heads = ", data.columns);
	// 					console.log("heads = ", data[0]);

	// 				// 	data = mdm.tlFormat(data);
	// 				// 	console.log("Formated data length = \n", data.length);

	// 				// 		// console.log("item = \n");					
	// 				// // 	// });	
	// 				// } catch (err) {
	// 				// 	console.error(err);
	// 				// 	console.error(err.message);
	// 				// }
	// 			// }
	// 			return data;
	// 		} else {return err;}
	// 	} catch(err) {
	// 		return err;
	// 	}	
	// });
	// }).then((d) => {
	// 	console.log("File data = ", d);
	// 	return d;
	// });

	// console.log(" === d3.csv returning ===\nd =\n", d, '\n======================');
	// return d;	
}

async function loadTimeline() {
	console.log(" = loadTL = ");
	// let tld = await mdm.loadTimeLineData();
	let tld = await d3.csv("./dist/assets/data/tl-all.csv");
		// .then((tld) => {
		// 	try {
		// 		if (tld) {
		// 			tld.then(function(d) {		
		// 					console.log("then ... d[0] = ", d[0], '\n');
		// 				// if (d) {
		// 				// 	console.log(" = loaded = ");
		// 				// }		
		// 				return d;
		// 			})	;
		// 		}
		// 		return tld;
		// 	} catch (e) {
		// 		console.error(e);
		// 		console.log(e);
		// 		console.log("WTF");
		// 	}

		// });
		return tld;
}

let mdm = new dm.DataManager();
let tld = mdm.loadTimelineData();
// let tld = loadTimeline();
tld.then( (tld) => {console.log("tld = ", tld[0])} );

// // https://grokbase.com/t/gg/d3-js/13455qtpph/d3-csv-on-node
// fs.readFile('./prevelance.csv', 'utf8', function (err, data) {
// d3.csv.parse(data);
// })
