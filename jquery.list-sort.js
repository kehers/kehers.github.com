(function($){
	var defaults = {
		// Is there any 'Handle' element within the main element?
		dragElement: null,
		// CSS class to add to cloned element
		cloneClass: null,
		// CSS class to add to element in available drop position
		dropClass: null,
		// Sometimes, you may just need to clone a part of item
		customClone: function($obj) { return false; },
		// Drag started. Got some housekeep to do before we continue?
		onStartDrag: function($me, event, $element) {},
		// Drag ended. What's next?
		onEndDrag: function(order) { }
	};
	
	var $element,
		selector,
		yBound,
		currentIndex,
		elementIndex,
		direction,
		foundAt = -1,
		customClone,
		dY,
		clone = null,
		draggedObject = null,
		$dragElement,
		dataStore = [];
	
	var methods = {
		init: function (options) {
			options = $.extend({}, defaults, options);
			
			$element = this;
			selector = this.selector;
			
			// What part of the element can be dragged?
			$dragElement = options.dragElement ? $(options.dragElement, this) :
								this;
			this.data("options", options);
			
			methods.calculatePositions();
			$dragElement.bind("mousedown.listSort", methods.startDrag);
			
			return this;
		},
		
		calculatePositions: function() {
			// Store the position of each [visible] item
			//   and bind the mousedown event to it
			var c = 0;
			var options = $element.data("options");
			$(selector).each(function(i){
				if ($(this).is(':visible')) {
					dataStore[c] = $(this)[0];
					if (c == 0)
						yBound = options.customClone($(this)) ?
								$(this).offset().top : $(this).position().top;
					c++;
				}
			});
		},
		
		startDrag: function(e) {
			var $this = $(this);
			var options = $element.data("options");

			var $obj = options.dragElement ? $this.parents(selector)
					: $this;
			options.onStartDrag($obj, e, $element);
			
			// Get current index (position) in the dom
			$(dataStore).each(function(i){
				if ($obj[0] == dataStore[i]) {
					currentIndex = i;
					elementIndex = i;
					return false;
				}
			});
			
			var startY = $obj.offset().top;
			var startX = $obj.offset().left;
			
			draggedObject = $obj[0];
			
			// Custom clones are appended to body			
			if (clone = options.customClone($obj)) {
				clone.appendTo('body');
			} else {
				// Append to parent to inherit styles
				clone = $obj.clone(false).appendTo($obj.parent());
				// But....what if parent have relative position?
				startY = $obj.position().top;
				startX = $obj.position().left;
			}

			dY = parseInt(e.clientY - startY);
			lastY = startY;
			
			clone.css({
					'position': 'absolute',
					'top': startY+'px',
					'left': startX+'px',
					'opacity': '0.3'
				});
				
			if (options.cloneClass)
				clone.addClass(options.cloneClass);
			
			$(window)
				.bind("mousemove.listSort", { source: $obj }, methods.dragMove)
				.bind("mouseup.listSort", { source: $obj }, methods.dragEnd)
					
			e.stopPropagation();
			return false;
		},
		
		dragMove: function(e) {		
            var $this = e.data.source;
            var options = $this.data("options");
			
			// Set the drag position once the mouse moves
			var ddY = parseInt(e.clientY - dY);
			
			// More items down and close to bottom?
			if ($(window).scrollTop() + $(window).height() < $(document).height() && ddY + 50 >= $(window).scrollTop() + $(window).height()) {
				var t = $(window).scrollTop() + 20;
				$(window).scrollTop(t);
				ddY += 20;
				dY -= 20;
			}
			
			// More items above and close to top?
			if ($(window).scrollTop() > $(dataStore[0]).offset().top && ddY - $(window).scrollTop() < 10) {
				var t = $(window).scrollTop() - 20;
				$(window).scrollTop(t);
				ddY -= 20;
				dY += 20;
			}
		
			var midpoint = $this.height()/2 + ddY - yBound;
			
			foundAt = -1;
			$(dataStore).each(function(i){
				var $el = $(dataStore[i]);
				var thisFromTop = $el.offset().top - yBound;
				if (midpoint >= thisFromTop
					&& midpoint <= thisFromTop + $el.height()) {
					foundAt = i;
					return false;
				}
			});
			
			direction = (ddY > lastY) ? 0 : 1;
			
			// Move clone
			clone.css({'top': ddY + 'px'});
			
			if (options.dropClass)
				$(selector).removeClass(options.dropClass);
			
			// Still in comfort zone
			if (foundAt == elementIndex) {
				if (options.dropClass)
					$(dataStore[foundAt]).addClass(options.dropClass);
				foundAt = -1;
			}
			
			if (foundAt != -1) {
				currentIndex = foundAt;
				lastY = ddY;
				clone.css({'opacity':'0.8'});
				if (options.dropClass)
					$(dataStore[foundAt]).addClass(options.dropClass);
			}
			
			e.stopPropagation();
			return false;
		},
		
		dragEnd: function(e) {
            var $this = e.data.source;
            var options = $this.data("options");
			
            $(window).unbind("mousemove.listSort")
					 .unbind("mouseup.listSort");

			if (options.dropClass)
				$(selector).removeClass(options.dropClass);
			
			// Kill the clone
			clone.remove();
			clone = null;
			
			// Dragged to a good position?
			if (foundAt != -1) {
				// Change element dom
				if (direction == 1) {
					$(draggedObject).insertBefore($(dataStore[currentIndex]));
				}
				else {
					$(draggedObject).insertAfter($(dataStore[currentIndex]));
				}
				
				// DOM has changed, reindex the dataStore
				methods.calculatePositions();
				
				draggedObject = null;
				foundAt = -1;
				
				options.onEndDrag(dataStore);
			}
		
		}
	};
	
	$.fn.listSort = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method '+method+' does not exist on jQuery.listSort');
        }
	};
})(jQuery);