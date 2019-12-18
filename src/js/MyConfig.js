/**
 * MyConfig
 */

/**
 *
 */

/**
 * My Files
 */
let dataPath = "./dist/assets/data/"

// Overview
let overviewFileStr = dataPath + "dail-representation-tots-extreme.csv";;

// Timeline 
let timelineFileStr = dataPath + "tl-all.csv";

// Census
let censusFileStr = dataPath + "census-all.csv";

// GEO (multiple)
let geoFileStr = (actYear, censusYears) => {
	// async loadFile(actYear, censusYears) {
	return dataPath + "geo-data/act" + actYear + 
				"--census" + censusYears[0] +
				"-" + censusYears[censusYears.length-1] + ".geojson";
}

let censusYears = [1936, 1946,1951,1956,1961,1966,1971,1979,1981,1986,1991,1996,2002,2006,2011,2016]
let cols = [{'Act': 1935, 'Pop': 1926},
	{'Act': 1947, 'Pop': 1936, 'Ratio': 1936},
	{'Act': 1947, 'Pop': 1946, 'Ratio': 1946},
	{'Act': 1947},
	{'Act': 1961, 'Pop': 1956},
	{'Act': 1961, 'Pop': 1961},
	{'Act': 1969},
	{'Act': 1974},
	{'Act': 1980},
	{'Act': 1983},
	{'Act': 1990},
	{'Act': 1995},
	{'Act': 1998},
	{'Act': 2005, 'Pop': 2002, 'Ratio': 2002},
	{'Act': 2009, 'Pop': 2006, 'Ratio': 2006},
	{'Act': 2013, 'Pop': 2011}];
// for (let i = 0; i < censusYears.length; i++) {
	// // let i;
	// // for ([i, c] in enumerate(censusYears)) {

	// // change strings to numerics
	// // d[census[str(c)] = cols[i];
	// let c = censusYears[i];
	// // console.log("Census = ", c);
	// // console.log("cols = " + 'Act'+cols[i].Act);
	// // console.log("");
// }


	


// let geos = [
// 	{
// 		'act': 2013,
// 		'census': [2011, 2016],
// 		'displayCensus': 2016
// 	}, {
// 		'act': 2009,
// 		'census': [2006, 2011],
// 		'displayCensus': 2011
// 	}
// ];

let style_default =	{
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.6,
	}


let style_highlight =	{
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	}