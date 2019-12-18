/**
 * magicBorder
 */

// 
// http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
// 
(function (root, factory) {
	if(typeof define === "function" && define.amd) {
		// Now we're wrapping the factory and assigning the return
		// value to the root (window) and returning it as well to
		// the AMD loader.
		define([], function(){
			return (root.myModule = factory());
		});
	} else if(typeof module === "object" && module.exports) {
		// I've not encountered a need for this yet, since I haven't
		// run into a scenario where plain modules depend on CommonJS
		// *and* I happen to be loading in a CJS browser environment
		// but I'm including it for the sake of being thorough
		module.exports = (root.myModule = factory());
	} else {
		root.myModule = factory();
	}
}(this, function() {

	const 	NO_TOP = 1,
			PART_TOP = 2,
			NO_BOTTOM = 3,
			PART_BOTTOM = 4;

	function getGeometry(els){
		els.forEach(
			function(el, i, els) { 
				// console.log('el = ', el);
				el['style'] = window.getComputedStyle(el.domEl);
				// console.log('el.style = ', el.style);
				// el['left'] 	= +el.domEl.style.left.match(/(\d+\.\d+).*/)[1];
				// use getPropertyValue to get latest applied styles 
				el['left'] 	= +el.style.getPropertyValue('left').match(/(\d+\.?\d?).*/)[1];
				el['width'] = +el.style.getPropertyValue('width').match(/(\d+\.?\d?).*/)[1];
				el['height'] = +el.style.getPropertyValue('height').match(/(\d+\.?\d?).*/)[1];
				el['end'] 	= +el.left + el.width;					
			},
			'myThisThing'
		);
		return els;
	}

	function getShape(els) {
		/**
		 *	3 types
		 *			TOP element (bottom-border), 	BOTTOM element (top-border)
		 *	1. 		open, 							part open
		 *	2, 		part open, 						open
		 *	3. 		part open, 						part open
		 */
		/**
		 * 	we do not check the element vertical positions
		 * 	... we just assume the are correct
		 */
		let shape = 0;
		if (els[0].left == els[1].left && els[0].end < els[1].end) { 
			shape = 1;
		} else if (
			Math.floor(els[0].left) < Math.floor(els[1].left) && 
			Math.floor(els[0].left + els[0].width) == Math.floor(els[1].left + els[1].width)
		) { 
			shape = 2;
		} else if (
			els[0].left < els[1].left &&
			Math.floor(els[0].left + els[0].width) < Math.floor(els[1].left + els[1].width)
		) { 
			shape = 3;
		}
		return shape;
	}

	function getPath(pathType, el, w0) {
		let h = el.height;
		let w = el.width;
		let myPath;
		switch(pathType){
			case (NO_BOTTOM): {
				myPath 	= 	" M "  + (w) + ", " + h + 
							" v "  + -h + 
							" h -" + (w) + 
							" v "  + (h);
				break;
			}
			case PART_BOTTOM: {
				myPath 	= 	" M "  + (w) + ", " + h + 
							" v "  + -h + 
							" h -" + (w) + 
							" v "  + (h) + 
							" h "  + (w0);
				break;
			}
			case NO_TOP: {
				myPath 	= 	" M "  + (w) + ", 0" +
							// " h "  + (w+borderWidth) + 
							" v "  + (h) + 
							" h -" + (w) + 
							" v -" + (h);
				break;
			}
			case PART_TOP: {
				myPath 	= 	" M "  + (w0) + ", 0" +
							" h "  + (w-(w0)) + 
							" v "  + (h) + 
							" h -" + (w) + 
							" v -" + (h);
				break;
			}
		}
		return myPath;		
	}

	/**
	 *
	 */
	function viewSizeReset(els, borderWidth, borderColor) {
		
		// WE SHOULD NOT HAVE TO DO THE CHECKS AGAIN FOR A RESIZE
		// THEY WILL HAVE THE SAME LAYOUT		
		
		// window.addEventListener('resize', this.viewSizeReset, false);	
		els = getGeometry(els);
		
		let shape = getShape(els);
		console.log("shape = " + shape);

		let w0 = 0;
		switch (shape) {
			case (1): {
				els[0]['path'] = getPath(NO_BOTTOM, els[0]);
				w0 = els[0].width - els[0].borderWidth;
				els[1]['path'] = getPath(PART_TOP, els[1], w0);
				break;
			}
			case (2): {
				w0 = els[1].left - els[0].left + els[0].borderWidth;
				els[0]['path'] = getPath(PART_BOTTOM, els[0], w0);
				els[1]['path'] = getPath(NO_TOP, els[1]);
				break;
			}
			case (3): {
				w0 = els[1].left - els[0].left + els[0].borderWidth;
				els[0]['path'] = getPath(PART_BOTTOM, els[0], w0);

				w0 =  els[0].left + els[0].width - els[1].left - els[0].borderWidth;
				els[1]['path'] = getPath(PART_TOP, els[1], w0);
				break;	
			}
			default: {
				console.log("inappropriate elements");
				console.log("els[0] = " + els[0]);
			}
		}
		if (els[0].path) {
			applyBorder(els[0]);
			applyBorder(els[1]);
		}
		// return elements;
	}	

	function applyBorder(el) {
		el.domEl.style.padding =						
				el.borderWidth + 'px';

		let svgStr = makeSVG(el)
		let myUrl = 'url("data:image/svg+xml;charset=UTF-8,' + svgStr + '")';
		el.domEl.style.borderImage =	
				myUrl +
				el.borderWidth/2 + ' / ' + 
				el.borderWidth + 'px stretch';
		// el.className = "mySVG";
	}

	function makeSVG(el) {
		let svgStr = "<svg xmlns='http://www.w3.org/2000/svg"  + 
				"' width='" + el.width + 
				"' height='" + el.height + 
				"'><path fill='none" +
				"' stroke='" + el.borderColor +
				"' stroke-width='" + el.borderWidth + "px' d='";
		return svgStr + el.path + "'/></svg>";
	}

	var myModule = {
		makeBorder: function(elements, borderWidth, borderColor) {
			// we only ever have 2 dom elements by nature		
			
			let top = 	 {'domEl': elements[0], 'borderWidth': borderWidth, 'borderColor': borderColor}, 
				bottom = {'domEl': elements[1], 'borderWidth': borderWidth, 'borderColor': borderColor};
	
			let els = [top, bottom];
			viewSizeReset(els);

			this.els = [top, bottom];	
			let that = this;
			window.addEventListener(
				'resize', 
				function(e) { 
					// BOGUS
					// HAVE TO SET EL.BORDER-WIDTH...
					viewSizeReset(that.els);
				}
				, true
			);
		}
	}
	return myModule;
}));