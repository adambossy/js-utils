/* Deps: jquery-1.4.4.js */

/*
    Usage: $("input[type=text]").formtip();
    Uses title attribute of selected object as placeholder text.
*/

(function($) {
    $.fn.formtip = function(settings) {
        var blurClass = 'placeholder',
            focusClass = 'focus';

        return this.each(function() {
            $(this)
                .attr('title', $(this).val())
                .keyup(function() {
                    $(this).removeClass(blurClass);
                    clearTip.apply(this, [blurClass]); 
                }).click(function() {
                    clearTip.apply(this, [blurClass]);
                }).blur(function() {
                    $(this).removeClass(focusClass); // may be necessary for ie7
                    if ($(this).val() == '') {
                        $(this)
                            .addClass(blurClass)
                            .val( $(this).attr('title') );
                    }   
                }).focus(function() {
                    $(this).addClass(focusClass); 
                }); // may be necessary for ie7
        }); 
    }   

    function clearTip(blurClass) {
        // Clear default text on initial click
        if ($(this).val() == $(this).attr('title')) {
            $(this)
                .removeClass(blurClass)
                .val('');
        }   
    }   
})(jQuery);
