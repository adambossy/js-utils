// Binary search implementation

(function($) {
	Array.prototype.search = function(value, comparefn) {
		var that = this;
		function binarySearch(value, low, high) {
			// Returns the location of value in array 
			//		or where value SHOULD go
			var mid = Math.floor((high - low)/2) + low,
				res = comparefn && comparefn(that[mid], value);
			if (high < low) {
				return mid+1; // change this to -1 if not found for traditional binary search
			}
			if (res > 0) {
				return binarySearch(value, low, mid-1);
			} else if (res < 0) {
				return binarySearch(value, mid+1, high);
			} else {
				return mid;
			}
		}
		return binarySearch(value, 0, this.length-1);
	};

	/*
		Tests - can be run from JS console in Firebug
		TODO write proper test cases using qunit

		comparator('b', 'e'); // -1
		comparator('f', 'e'); // 1
		comparator('e', 'e'); // 0

		console.log(['b', 'c', 'd', 'e', 'f'].search('f', comparator));
		console.log(['b', 'c', 'd', 'e', 'f'].search('b', comparator));
		console.log(['b', 'c', 'd', 'e', 'f'].search('d', comparator));
		console.log(['b', 'c', 'd', 'e', 'f'].search('g', comparator));
		console.log(['b', 'c', 'd', 'e', 'f'].search('a', comparator));
	*/
})(jQuery);

// Needs generalization for arbitrary jQuery objects
(function($) {
	// $el - the element to append
	// list - an array of data which is searched to determine
	//			where the new element should be appended
	// comparefn - an optional comparator function
	$.fn.appendSorted = function($el, value, list, comparefn) {
		return this.each(function() {
			// pre: $(this) is the new parent of $el
			// e.g.,
			//   <ul> <- $(this)
			//		<li> <- $el
			//		<li>
			//	</ul>

			// Ideas for generalization:
			// * Have a function to grab item names and function to 
			//		identify which elements to loop over (like `key` in Python's `sorted`)
			// * Function to grab item names can be reused here
			// * $.trim could be called in appendSorted so caller doesn't have to
			var index = list.search(value, comparefn || comparator);

			$(this)
				.children()
				.eq(index)
				.before( $el );
		});
	}

	// default comparator
	function comparator(a, b) {
		if (a === b) {
			return 0;
		}
		return (a < b) ? -1 : 1;
	}
})(jQuery);


