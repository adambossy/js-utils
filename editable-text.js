/*
	Editable text - Allows a label to become an editable textbox when clicked. 
		Utilizes the following html (written as a Django template):

	<div class="editable-text{% if class_ %} {{ class_ }}{% endif %}">
		<!-- Displays when in edit mode -->
		<div class="editable-text-container editable-text-edit">
			<input type="text" class="editable-text-label" data-topic="{{ topic.id }}" val="{{ topic.title }}" />
			<a class="save" href="javascript:;">Save</a>
				<span class="spacer">·</span>
			<a class="cancel" href="javascript:;">Cancel</a>
		</div>

		<!-- Displays when not in edit mode -->
		<div class="editable-text-container editable-text-display">
			<span class="editable-text-label{% if default %} default{% endif %}">{{ default_text }}</span>
			<a class="edit" href="javascript:;">Edit</a>
		</div>
	</div>

	author - https://www.github.com/adambossy (Adam Bossy)
*/

;(function($) {
	var edit			= ".editable-text-edit",
		display			= ".editable-text-display",
		editLabel		= edit + " .editable-text-label",
		displayLabel	= display + " .editable-text-label",
		root			= ".editable-text";

	$.fn.edit = function(settings) {
		return this.each(function() {
			var $title = $(this).children().eq(0), // this is brittle
				$edit  = $(this).children().eq(1),
				$root  = $(this).closest(root);

			$(this)
				.click(function() {
					$(this).hide();
					$(edit, $root).show();
					$(editLabel, $root)
						.val( $title.text() )
						.select()
						.data('oldtext', $title.text());

					var $displayLabel = $(displayLabel, $root),
						defaultText = $displayLabel.data('defaulttext');

					if (typeof defaultText == "undefined") { // Set once
						$displayLabel.data('defaulttext', $displayLabel.text());
					}
				});
		});
	};
 
	$.fn.save = function(saveCallback) {
		// saveCallback - fn(text, callback)
		//		function to an handle text save event and execute callback when completed
		return this.each(function() {
			var that	= this,
				$input	= $(this).find('input'),
				$save	= $(this).find('.save'),
				$cancel = $(this).find('.cancel'),
				$root	= $(this).closest(root);

			function showEdit() {
				$(that).hide();
				$(display, $root).show();
			}

			function ajaxCallback(json) {
				if (json.status == "success") {
					$(displayLabel, $root).text( $input.val() );
				} else if (json.status == "failure") {
					$('.notification2') // TODO Needs an API and should act like a singleton
						.show()
						.text(json.message);
				}
				
				showEdit();

				// Check if default text is there, if not, un-gray
				var $displayLabel = $(displayLabel, $root),
					defaultText = $displayLabel.data('defaulttext');

				if ($displayLabel.text() != defaultText) {
					$displayLabel.removeClass('default');
				} else {
					$displayLabel.addClass('default');
				}
			}

			function saveAction() {
				if (typeof saveCallback != "undefined") {
					saveCallback(
						$input.val(),
						ajaxCallback
					);
				}
			}

			function cancelAction($el) {
				var oldText = $input.data('oldtext');
				$input.val(oldText);
				showEdit();
			}

			/*
			$(document).mousedown(function(e) { 
				// Check for background mouse clicks
				if (e.target != $input) {
					saveAction();
				}
			});
			*/

			$input.enterkey(function() { saveAction(); });
			$input.esckey(function() { cancelAction(); });

			$save.click(saveAction);
			$cancel.click(cancelAction);
		});
	};
})(jQuery);

