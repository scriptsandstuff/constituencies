/**
*
*/
(function(exports) { 
	function getColor(d) { 
	 	return 	d >= 30 ? 	'blue' :
	 			// d >  25  ? 	'yellow' :
	 			// d >  20  ? 	'orange' :
	 			d > 20 	? 	'green' :
	 						'#8b0000';
	}

	function getChromaLedgend() {
		return '<img src="./dist/assets/images/colour-legend.svg"/>'
	}
	

	function getColourLabel(from, text) {
		return '<i style="background-color:' + 
				getColor(from + 1) + 
				'"></i>' + text;
	}


	function getChromaLedgend1() {
		let	grades 	= [20, 25, 30],
			from	= 0, // grades[0] - 2;
			to,
			labels 	= [];
		
		labels.push(getColourLabel(from, '0&ndash;' + grades[0]));
		for (let i = 0; i < grades.length - 1; i++) {
			from = 	grades[i];
			to 	 = 	grades[i + 1];

			labels.push(getColourLabel(from, from + '&ndash;' + to ));
			// from + (to ? '&ndash;' + to : '+'));
		}
		from = grades[grades.length-1];
		labels.push(getColourLabel(from, from + '+'));

		return 'Pop per TD<br>(Thousands)<br>' + labels.join('<br>');
	}
	exports.getChromaLedgend = getChromaLedgend;
	exports.getColor = getColor;
})( typeof exports === 'undefined' ? this['MyChromaKey'] = {}: exports );