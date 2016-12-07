/* ============================================================
 * Gallery
 * Showcase your portfolio or even use it for an online store!
 * For DEMO purposes only. Extract what you need.
 * ============================================================ */

$(function() {

    /* GRID
    -------------------------------------------------------------*/

    /* 
        Wait for the images to be loaded before applying
        Isotope plugin. 
    */
    var $gallery = $('.gallery');
    $gallery.imagesLoaded(function() {
        applyIsotope();
    });

    /*  Apply Isotope plugin 
        isotope.metafizzy.co
    */
    var applyIsotope = function() {
        $gallery.isotope({
            itemSelector: '.gallery-item',
            percentPosition: true,
            masonry: {
              columnWidth: '.grid-sizer',
              gutter: 0
            }
        })
    }



});