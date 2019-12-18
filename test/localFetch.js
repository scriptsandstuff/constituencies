
const fs = require('fs')
// global.fetch = require('../node_modules/node-fetch/lib/index.js');
// global.fetch = require('node-fetch');

let fileUrl = require('file-url');
let fileStr = './dist/assets/data/census-all.csv'
// fileStr = fileUrl(fileStr); //, {resolve: false});
console.log("fileStr = ", fileStr);
// let d = fetch(fileStr)
// 	.then((d) => {
// 		console.log("d = ", d);
// 	})
// 	.catch((err) => {
// 		console.log("failed = ", err);
// 	});



// global.fetch = async function(fileStr) {
global.fetch =  function(fileStr) {
	// console.log("FETCHING");
	// let d = 
	return fs.readFileSync(fileStr, 'utf8', 
		(err, data) => {
			if(!err) {
				console.log("Reading File");
				console.log("File data = ", data[0]);
			} else {
				console.log("READ ERROR = ", err);
				throw err;
			}
			// data = doneReading(data);
			// console.log("Return data = ", data);
			// d = data;
			
			return data;			
		// }).then( (d) => {			
		// // .then((data)=>{console.log("Return d[0] = ", data[0]); return data;});
		// 	console.log("Return d = ", d);
		// 	return d;
		});
}

console.log("WILL FETCH");
let d = fetch(fileStr);
// console.log("d Fetched = ", d);
// d.then( (data) => {
// 		// console.log("d.then...err = ", err);
// 		console.log("d.then...d = ", d);
// 		console.log("d.then...data = ", data);
// 		// console.log(");
// 		// return d;
// 	});
console.log("d FINAL = ", d[0]);
	// .then((d) => {
	// .catch((err) => {
	// 	console.log("failed = ", err);
	// });