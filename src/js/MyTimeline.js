/**
 * MyTimeline.js
 */


(function(exports) { class MyTimeline {
	constructor() {
		// this.timeline = new vis.Timeline(document.getElementById('timeline-container'));
		this.timeline = new vis.Timeline(
			document.getElementsByClassName('timeline-container')[0]
		);

		this.timeline.setOptions(this.getOptions());
		this.timeline.setGroups(this.getGroups());

		this.enacted = [];
		this.effected = [];
		this.rangeChanged = false;	
	}
	
	getGroups() {
		let groups = new vis.DataSet([
			{ id: 0, content:"enacted" }, // minHeight: groupMinHeight
			{ id: 1, content:"effected" }
		]);		// nestedGroups: [3, 4],
				// showNested: true }
		return groups;
	}

	getOptions() {
		var start_date 	= new moment().subtract(11, 'years').format('YYYY-MM-DD');
		var end_date 	= new moment().add(1, 'years').format('YYYY-MM-DD');
		// console.log("start_date = ", start_date);	
		// console.log("end_date = ", end_date);	

		let height = "100%";
		var options = {
			start: 		start_date, 
			end: 		end_date, 
			height: 	height, 
			autoResize: false,
			stack: 		false
			// , margin: 			{item: {vertical: 5}}
			// , groupHeightMode: 	'fixed'
		};
		return options;
	}

	setItems(tlItems) {
		let items = new vis.DataSet();
		for (let item of tlItems) {
			items.update(item);			
			// console.log("item = ", item);
			// console.log("item.class' = ", item.className);
			if (item.className.includes('enacted')){
				this.enacted.push(item);
			}
			else if(item.className.includes('effected')){
				this.effected.push(item);
			}
		}	
		// console.log("items loaded = ", items)	
		this.timeline.setItems(tlItems);
		// console.log("enacted = ", this.enacted);
	}

	processBackgroundClick(p) {
		let what = p.what;
		let item = p.item; // backgrounds do not have p.item...so we have to find the item using date/time
		let group = p.group;	
		// console.log('clicked on timeline!!\n=============\np.group = \n', p.group);
		// console.log('what was clicked = ' + what + ', ' + item);
		// console.log('this.enacted = ', this.enacted);
		// console.log('this.effected = ', this.effected);
		let act, census;
		let items;
		switch(p.group) {
			case 0:
				items = this.enacted;
				break;
			case 1:
				items = this.effected;
				break;
			default:
				console.log('...click not on any track');
				// alert("click not on a background");
				return [];
		}
		let start, end;
		for (let d of items) {
			if (d.start < p.time && p.time < d.end) {
				// console.log('Act, Cen', d.act, d.census);
				return [d.act, d.census];
			}
		}
		return [];
	}
}
exports.MyTimeline = MyTimeline;
})( typeof exports === 'undefined' ? this['MyTimeline'] = {}: exports );