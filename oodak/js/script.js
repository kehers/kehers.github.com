(function ($) {


    $(document).ready(function () {

        // Global Variables
        window_w = $(window).width();
        window_h = $(window).height();
        window_s = $(window).scrollTop();
        mobilenav_screen_size = 820;

        $html = $('html');
        $body = $('body');

        if(history.pushState)
              var ionic_current_path = location.pathname;

        // Window Load and Resize
        $(window).bind('resize load', function () {

            window_w = $(window).width();
            window_h = $(window).height();
            window_s = $(window).scrollTop();

        });

        // Window Scroll
        $(window).scroll(function () {

            window_s = $(window).scrollTop();

        });


        // CSS3 transition support
        function supportsTransitions() {
            var b = document.body || document.documentElement,
                s = b.style,
                p = 'transition';

            if (typeof s[p] == 'string') { return true; }

            // Tests for vendor specific prop
            var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
            p = p.charAt(0).toUpperCase() + p.substr(1);

            for (var i=0; i<v.length; i++) {
                if (typeof s[v[i] + p] == 'string') { return true; }
            }

            return false;
        }


        /*************************************************/
        /*              TEMPLATE FEATURES                */
        /*************************************************/


        /* Element Features */

        enableStickyHeader(); // Sticky Header

        enableHoverStickyHeader(); // Hover Sticky Header

        enableMobileNav(); // Mobile Navigation

        //enableFlexSlider(); // Flexslider - Slider Plugin

        enableAccordions(); // Accordions

        //enableTabs(); // Tabs

        //enableProgressbars(); // Progressbars

        //enableCircularProgressbars(); // Circular Progressbars

        //enableTooltips(); // Bootstrap Tooltips

        //enableAlertBox(); // Alert Boxes

        enableFancyBox() // Fancy Box

        //enableCustomAudio(); // Custom Audio Player

        //enableSearchBox(); // Search Box

        //enableSearchPreBox(); // Search Box in Preheader

        //enableCustomInput(); // Custom Made Inputs

        enableSliderAlternativeOverlay(); // Alternative Slider Overlay

        enableGoogleMaps(); // Google Maps API

        //enableDatePicker(); // Form Datepicker

        //enableBackToTop(); // Back To Top Button

        enableNavigationButton(); // Navigation Button

        // enableStickyFooter(); // Sticky Footer


        /* Layout Features */

        //enableMasonryBlog(); // Masonry Blog

        //enableTimelineBlog(); // Timeline Blog

        //enableMixItUp(); // MixItUp - Filtering Plugin

        enableFullWidth(); // Full Width

        enableWOWAnimate(); // WOW Animate.css Plugin


        /* Action Features */

        //enableRecentProductRemove(); // Recent Product Remove

        //enableShopRefine(); // Shop Refine

        enableOnePageScroll(); // One Page Menu Items

        //enablePrettyPhoto(); // PrettyPhoto - Lightbox Plugin

        //enableFitVids(); // FitVids Plugin

        //enableSharrre(); // Sharrre - Social Media Sharing Plugin


        /* AJAX Features */

        //enableLoadMoreButton(); // Portfolio, Masonry AJAX Load More

        //enableTimelineLoadMore(); // Timeline AJAX Load More

        //enableWooCommerceAddToCart(); // WooCommerce Add To Cart

        //enableWooCommerceLoadMore(); // WooCommerce Load More

        // enableAjaxContactForm(); // Contact Form AJAX

        //enablePostLike(); // Post Like Options

        //enableAjaxPageLoad(); // AJAX page Loading




        /*************************************************/
        /*                  FUNCTIONS                    */
        /*************************************************/



        // Reinitilize All Features Function
        function reinitializeAllFeatures(){

            /* Element Features */

            initMenuFeatures(); // Mobile Nav

            enableFlexSlider(); // Flexslider - Slider Plugin

            enableAccordions(); // Accordions

            enableTabs(); // Tabs

            animateProgressBars(); // Progressbars

            initCircularProgressbars(); // Circular Progressbars

            enableTooltips(); // Bootstrap Tooltips

            enableAlertBox(); // Alert Boxes

            enableFancyBox() // Fancy Box

            initCustomAudio(); // Custom Audio Player

            initSearchBox(); // Search Box

            initMarineHeader(); // Marine Header

            enableCustomInput(); // Custom Made Inputs

            sliderAlternativeOverlay(); // Alternative Slider Overlay

            setTimeout(function(){
                enableGoogleMaps(); // Google Maps API
            }, 420);

            enableDatePicker(); // Form Datepicker

            // initStickyFooter() // Sticky Footer


            /* Layout Features */

            initMasonryBlog(); // Masonry Blog

            setTimelineBlog(); // Timeline Blog

            reinitializeMixItUp(); // MixItUp - Filtering Plugin

            setFullWidth(); // Set Fullwidth

            setTimeout(function(){
                enableWOWAnimate(); // WOW Animate.css Plugin
            }, 1200);


            /* Action Features */

            enableRecentProductRemove(); // Recent Product Remove

            enableShopRefine(); // Shop Refine

            enableOnePageScroll(); // One Page Menu Items

            enablePrettyPhoto(); // PrettyPhoto - Lightbox Plugin

            enableFitVids(); // FitVids Plugin

            enableSharrre(); // Sharrre - Social Media Sharing Plugin


            /* AJAX Features */

            enableLoadMoreButton(); // Portfolio, Masonry AJAX Load More

            enableTimelineLoadMore(); // Timeline AJAX Load More

            enableWooCommerceAddToCart(); // WooCommerce Add To Cart

            enableWooCommerceLoadMore(); // WooCommerce Load More

            // enableAjaxContactForm(); // Contact Form AJAX

            enablePostLike(); // Post Like Options

            initAjaxNav(); // AJAX page Loading

            setFullWidth();

            setTimeout(function(){
                setFullWidth();
            }, 400);

        }


        // Prevent FOUC(flash of unstyled content)
        jQuery("html").addClass("no-fouc");
        $("html").show();

        /**
         *  Form Datepicker
         */
        function enableDatePicker(){

            $('.datepicker-button .datepicker-el').datepicker({
                onSelect: function(){

                    var datePicker = $(this);
                    var datePickerWrap = datePicker.parents('.date-picker');
                    var currentDate = datePicker.datepicker( "getDate" );

                    if(currentDate){
                        var year = currentDate.getFullYear();
                        var month = currentDate.getMonth();
                        var day = currentDate.getDate();

                        datePickerWrap.find('.day').attr('value', day);
                        datePickerWrap.find('.month').attr('value', month);
                        datePickerWrap.find('.year').attr('value', year);

                        datePicker.fadeToggle(300);
                    }

                }
            });

            $('.datepicker-button .datepicker-icon').click(function(){
               $(this).parent().find('.datepicker-el').fadeToggle(300);
            });

        }




        /**
         *  Navigation Button
         */

        function enableNavigationButton(){

            // Initialize Navigaiton Button
            initNavigationButton();

            $(window).resize(function(){
                if(window_w < mobilenav_screen_size){
                    $('.navigation-style2').removeClass('nav-active');
                }
            });

        }

        function initNavigationButton(){

            $('#nav-button').click(function(){
                $(this).parent().find('.navigation-style2').toggleClass('nav-active');
            });

        }



        /**
         *  Back To Top button
         */

        function enableBackToTop(){

            // Show/Hide Back To Top Button
            $(window).scroll(function(){
                var offset = $(document).height() - window_h - 300;
                if($('#footer').length)
                    offset = $('#footer').offset().top - window_h;

                if(window_s > offset && window_w > 767){
                    $('#back-to-top').fadeIn(400);
                }else{
                    $('#back-to-top').fadeOut(400);
                }
            });

            // Back To Top
            $('#back-to-top a').click(function(e){
                e.preventDefault();

                // Duration
                var duration = 1200;
                if(window_s < 400)
                    duration = 600;
                if(window_s = 0)
                    duration = 0;

                $('html, body').animate(
                    {
                        scrollTop: 0+'px'
                    },
                    {
                        duration: duration,
                        easing: 'easeInOutCubic'
                    }
                );
            });

        }




        /**
         *  Sticky Header
         */
        function enableStickyHeader() {

            $(window).scroll(function () {

                window_s = $(this).scrollTop();
                window_w = $(this).width();

                if (window_s > 130 && window_w > 991) {

                    // Prevent Header Top Animation Flash Effect
                    if($('body').hasClass('headerstyle9') && !$('body').hasClass('sticky-header-on')){
                        $('#header').hide();
                        setTimeout(function(){
                            $('#header').show();
                        }, 300);
                    }

                    $('#header').addClass('sticky-header');
                    $('body').addClass('sticky-header-on');

                } else {

                    $('#header').removeClass('sticky-header');
                    $('body').removeClass('sticky-header-on');

                }

            });

            // Initialize Body Padding for Header
            initMarineHeader();
            $(window).bind('load resize', function(){
                initMarineHeader();
            });

        }


        function initMarineHeader(){
            if(window_w > parseInt(mobilenav_screen_size) && !$body.hasClass('headerstyle7') && !$body.hasClass('headerstyle8')){

                var $header = $('#header'),
                    header_h;

                if(!$header.hasClass('sticky-header')){
                    header_h = $header.height();
                    $body.css('padding-top', header_h);
                }else{
                    $header.removeClass('sticky-header');
                    header_h = $header.height();
                    $body.css('padding-top', header_h);
                    $header.addClass('sticky-header');
                }

            }else{
                $body.css('padding-top', '');
            }
        }



        /**
         *  Hover Sticky Header
         */
        function enableHoverStickyHeader(){

            var header_hover = false;
            var button_hover = false;

            $('#header').hover(function(){
                header_hover = true;
            }, function(){
                header_hover = false;
                setTimeout(function(){
                    if(!button_hover && !header_hover)
                        $('#header').removeClass('sticky-header-visible');
                }, 600);
            });

            $('#sticky-header-hover-button .button-content').hover(function(){
                button_hover = true;
                $('#header').addClass('sticky-header-visible');
                setTimeout(function(){
                   if(!header_hover){
                     $('#header').removeClass('sticky-header-visible');
                   }
                }, 1200);
            }, function(){
                button_hover = false;
            });

        }





        /* Sticky Footer */

        function enableStickyFooter(){

            // Initialize Sticky Footer
            initStickyFooter();
            $(window).bind('load resize', function(){
                if($body.hasClass('sticky-footer-on'))
                    fixStickyFooter();
            });

        }

        // Init Sticky Footer
        function initStickyFooter(){
            $body.addClass('sticky-footer-on')
            if($body.hasClass('sticky-footer-on')){
                fixStickyFooter();
            }
        }

        // Fix Sticky Footer
        function fixStickyFooter(){
            var footer = $('#footer');
            if(footer.length){
                var footer_h = $('#footer').height();
                $body.css('padding-bottom', footer_h);
            }
        }




        /* Search Box */
        function enableSearchBox() {

            initSearchBox();

			$(document).click(function(e){
				if (!$('#search-box, #search-box *').is(e.target)){
					$('#search-box').removeClass('search-box-opened');
				}
			});

        };

        function initSearchBox(){
            $('#search-box>.icons').click(function () {
                $(this).parent().toggleClass('search-box-opened');
            });
        }

		/* Search Box Preheader */
        function enableSearchPreBox() {

            initSearchBoxPre();

			$(document).click(function(e){
				if (!$('#search-box-pre, #search-box-pre *').is(e.target)){
					$('#search-box-pre').removeClass('search-box-opened');
				}
			});

        };

        function initSearchBoxPre(){
            $('#search-box-pre>.icons').click(function () {
                $(this).parent().toggleClass('search-box-opened');
            });
        }


        // WOW Animate.css Plugin
        function enableWOWAnimate(){

           	var isMobileBrowser = navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);

            // WOW animate.css if transitions are supported
            if(supportsTransitions() && !isMobileBrowser){
                var off = window_h/5;

                var wow = new WOW({
                    offset: off
                });

                wow.init();
            }

        }







		/* Cookie Manipulations Functions */

		// Create Cookie
		function createCookie(name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		}

		// Erase Cookie
		function eraseCookie(name) {
			createCookie(name,"",-1);
		}






        /* Recent Product Remove */
        function enableRecentProductRemove() {
            // Single Remove Button
            $('.remove-product-button').click(function (e) {

                e.preventDefault();

				// Load Recently Viewed Array
				var name = 'woocommerce_recently_viewed' + "=";
				var ca = document.cookie.split(';');
				recently_viewed = new Array();
				for(var i=0; i<ca.length; i++) {
					var c = ca[i].trim();
					if (c.indexOf(name) == 0) {
						recently_viewed = c.substring(name.length, c.length).split('%7C');
					}
				}

				// Erase Cookie
				eraseCookie('woocommerce_recently_viewed');

				// Create New Recently Viewed Array
				new_recently_viewed = new Array();
				if (recently_viewed instanceof Array) {
					j = 0;
					for (i=0; i<recently_viewed.length; i++) {
						if (recently_viewed[i] == $(this).data('id')) {
							continue;
						}
						new_recently_viewed[j] = recently_viewed[i];
						j++;
					}
				}

				// Create New Cookie
				createCookie('woocommerce_recently_viewed', new_recently_viewed.join('|'));

				// Fade Out Elemenet
                $(this).parents('.recently-viewed-product').fadeOut(300, function () {
                    $(this).remove();
                });

            });

            // Remove All Button
            $('.clear-recent-products').click(function (e) {

                e.preventDefault();

                $('.recently-viewed-product').each(function () {
                    $(this).fadeOut(300, function () {
                        $(this).remove();
                    });
                });

				// Erase Cookie
				eraseCookie('woocommerce_recently_viewed');

            });

            // Remove From Shopping Cart Button
            $('.shopping-cart .remove-product').click(function (e) {
                e.preventDefault();
                $(this).parents('tr').fadeOut(300, function () {
                    $(this).remove();
                });
            });

        }



        /* Custom Made Inputs */
        function enableCustomInput() {
            /* Numeric Input */

			if ($('.shopping-cart').length > 0) {

				$('input[type="number"]').each(function () {
					$(this).wrap('<div class="numeric-input-holder"></div>');


					$(this).parent().prepend('<div class="decrease-button"></div>');
					$(this).parent().append('<div class="increase-button"></div>');
					// Decrease Button
					$(this).parent().find('.decrease-button').click(function () {
						var value = parseInt($(this).parent().find('input[type="number"]').val());
						value--;
						$(this).parent().find('input[type="number"]').val(value);
					});
					// Increase Button
					$(this).parent().find('.increase-button').click(function () {
						var value = parseInt($(this).parent().find('input[type="number"]').val());
						value++;
						$(this).parent().find('input[type="number"]').val(value);
					});
					// Prevent Not A Number(NaN) Value
					$(this).keypress(function (e) {
						var value = parseInt(String.fromCharCode(e.which));
						if (isNaN(value)) {
							e.preventDefault();
						}
					});
				})
			}
        }




        /* Shop Refine */
        function enableShopRefine() {

            // Shop product perdectscrollbar
            $('.shop-products-recommend').perfectScrollbar({
                wheelSpeed: 20,
                wheelPropagation: true, minScrollbarLength: 20,
                suppressScrollX: true
            });

			$('#reviews').perfectScrollbar({
				wheelSpeed: 20,
                wheelPropagation: true, minScrollbarLength: 20,
                suppressScrollX: true
			});


			if ($('.price_slider').length > 0) {
				var noUi_slider = $('.price_slider');
				var noUi_slider_parent = noUi_slider.parent();

				var noUi_min = parseInt($('#min_price').data('min'));
				var noUi_max = parseInt($('#max_price').data('max'));
				var noUi_min_start = parseInt($('#min_price').data('min'));
				var noUi_max_start = parseInt($('#max_price').data('max'));

				if(woocommerce_price_slider_params.currency_symbol)
					var currency = woocommerce_price_slider_params.currency_symbol;
				else
					var currency = '$';

				noUi_slider.noUiSlider({
					start: [ noUi_min_start, noUi_max_start ], range: {
						'min': [ noUi_min ],
						'max': [ noUi_max ]
					}, serialization: {
						lower: [
							$.Link({
								target: $('.price_slider_amount .price_label .from', noUi_slider_parent)
							})
						],
						upper: [
							$.Link({
								target: $('.price_slider_amount .price_label .to', noUi_slider_parent)
								})
							],
						format: {
							decimals: 0,
							mark: ',',
							prefix: currency
						}
					}
				});
			}


            $('.sidebar .shop-widget').each(function () {
                // Perfect Scrollbar
                $(this).not('.product-price-range').find('>ul')
                    .perfectScrollbar({
                        wheelSpeed: 20,
                        wheelPropagation: true,
                        minScrollbarLength: 20,
                        suppressScrollX: true
                    });
                // noUI Slider

                // Accordions
                $(this).not('.opened').find('>ul,>form').hide();
                $(this).find('.arrow').click(function () {
                    if (!$(this).parents('.shop-widget').hasClass('opened')) {
                        $(this).parents('.shop-widget').addClass('opened')
                            .find('>ul,>form').slideDown(400, function () {
                                $(this).perfectScrollbar("update");
                            });
                    } else {
                        $(this).parents('.shop-widget').removeClass('opened')
                            .find('>ul,>form').slideUp(400);
                    }
                });
            });
        }


        /* FlexSlider */

        function enableFlexSlider() {

            /* FullScreen Slider */
            $('.main-flexslider').flexslider({
                animation: "slide",
                controlNav: false,
                prevText: "",
                nextText: ""
            });

			/* Shop Product Slider */
			$('.shop-product-slider').flexslider({
				animation: "slide",
				controlNav: "thumbnails",
				prevText: "",
				nextText: "",
				smoothHeight: true
			});

            /* Portfolio Slider */
            $('.portfolio-flexslider').flexslider({
                animation: "slide",
                controlNav: false,
                prevText: "",
                nextText: ""
            });

			/* Post Gallery Slider */
			$('.post-image-gallery:not(".slider-enabled")').flexslider({
				animation: "slide",
				controlNav: false,
				prevText: "",
				nextText: ""
			});

            /* Chefs Slider */
            $('.chefs-slider').flexslider({
                animation: "fade",
                animationSpeed: 0,
                slideshow: false,
                controlNav:false,
                prevText: "",
                nextText: ""
            });

            /* Food Menu Slider */
            $('.food-menu-slider').flexslider({
                animation: "slide",
                animationSpeed: 0,
                smoothHeight: true,
                controlNav:false,
                slideshow: false,
                prevText: "",
                nextText: ""
            });

            /* Motors Slider */
            $('.motors-slider').flexslider({
                animation: "slide",
                animationSpeed: 600,
                smoothHeight: true,
                controlNav:true,
                slideshow: false
            });


            /* Food Menu Full Slider */
            $('.food-menu-full').each(function(){

                var slider = $(this).find('.food-menu-full-slider'),
                    nav = $(this).find('.food-menu-nav .food-menu-nav-item');

                slider.flexslider({
                    animation: "slide",
                    animationSpeed: 0,
                    smoothHeight: true,
                    controlNav: true,
                    slideshow: false,
                    prevText: "",
                    nextText: "",
                    manualControls: nav
                });

            });

            /* Tweets Slider */
            $(window).on('load', function(){
                $('.tweets-flexslider').flexslider({
                    animation: "slide",
                    controlNav: false,
                    directionNav: false,
                    touch: true,
                    slideshowSpeed: 3000,
                    animationSpeed: 400,
                    prevText: "",
                    nextText: "",
                    start: function (slider) {

                        slider.find('.arrow-left').click(function () {
                            slider.flexAnimate(slider.getTarget("prev"));
                        });

                        slider.find('.arrow-right').click(function () {
                            slider.flexAnimate(slider.getTarget("next"));
                        });

                    }
                });
            });

            /* Product Slider with Carousel Nav */
            $('.products-carousel').flexslider({
                animation: "slide",
                controlNav: false,
                directionNav: false,
                animationLoop: false,
                slideshow: false,
                itemWidth: 70,
                itemMargin: 6,
                asNavFor: '.products-slider',
                start: function (slider) {

                    slider.find('.arrow-left').click(function () {
                        slider.flexAnimate(slider.getTarget("prev"));
                    });

                    slider.find('.arrow-right').click(function () {
                        slider.flexAnimate(slider.getTarget("next"));
                    });

                }
            });

            $('.products-slider').flexslider({
                animation: "slide",
                controlNav: false,
                directionNav: false,
                animationLoop: false,
                slideshow: false,
                sync: ".products-carousel"
            });

            $('.flexslider-thumbnail-gallery').flexslider({
                animation: "fade",
				animationSpeed: 300,
                controlNav: "thumbnails",
                directionNav: false,
				start: function(slider){

					var $slider = slider;

					$('.slides li', $slider).not('.clone').each(function(index, value){
						var tooltip = $(this).data('tooltip');
						$slider.find('.flex-control-nav li').eq(index)
						.attr('title', tooltip)
						.tooltip({
							placement: 'top',
							animation: false
						});;
					});

					$slider.find('.flex-control-nav li').hover(function(){
						$('img',this).trigger('click');
					});

				}
            });


            $('.testimonial-slider').flexslider({
                animation: "slide",
                animationSpeed: 0,
                smoothHeight: true,
                controlNav: "bullets",
                slideshow: false,
                directionNav: false
            });

            $(window).load(function(){
                $(window).trigger('resize');
            });

        }


        /* Accordions */

        function enableAccordions() {

            $('.accordions').each(function () {

                // Set First Accordion As Active
                $(this).find('.accordion-content').hide();

                if ($(this).find('.accordion:first-child').hasClass('accordion-active')) {
                    $(this).find('.accordion:first-child .accordion-content').show();
                }


                // Set Accordion Events
                $(this).find('.accordion-header').click(function () {

                    if (!$(this).parent().hasClass('accordion-active')) {

                        // Close other accordions
                        $(this).parent().parent().find('.accordion-active').removeClass('accordion-active').find('.accordion-content').slideUp(300);

                        // Open Accordion
                        $(this).parent().addClass('accordion-active');
                        $(this).parent().find('.accordion-content').slideDown(300);

                    } else {

                        // Close Accordion
                        $(this).parent().removeClass('accordion-active');
                        $(this).parent().find('.accordion-content').slideUp(300);

                    }

                });

            });

        }


        /* Tabs */

        function enableTabs() {

            $('.tabs').each(function () {

                // Set Active Tab
                $(this).find('.tab').hide();
                $(this).find('.tab:first-child').show();
                $(this).find('.tab-header ul li:first-child').addClass('active-tab');


                // Prevent Default
                $(this).find('.tab-header li a').click(function (e) {
                    e.preventDefault();
                });


                // Tab Navigation
                $(this).find('.tab-header li').click(function () {

                    var target = $(this).find('a').attr('href');

                    $(this).parent().parent().parent().find('.tab').fadeOut(200);
                    $(this).parent().parent().parent().find(target).delay(200).fadeIn(200);

                    $(this).parent().find('.active-tab').removeClass('active-tab');
                    $(this).addClass('active-tab');


                });


            });

        }


        /* Mobile Navigation */

        function enableMobileNav() {

            // navigation
            if($('#sidemenu').length == 0){
                var navigation = $('#main-nav');
                if(!navigation.length){
                    navigation = $('#header div.menu>ul');
                }
            }else{
                var navigation = $('#side-nav>ul');
            }

            // Mobile Menu Button
            initMenuFeatures();

			// On Resize
            $(window).resize(function () {
                if (window_w > parseInt(mobilenav_screen_size)) {
                   	navigation.show().removeClass('nav-opened');
                }else{
                	navigation.hide().removeClass('nav-opened');
                }
            });

			fixMegaMenu();
            fixSidemenu();

            // Fix Sidemenu Overlaping, and Mega Menu
            $(window).bind('load resize', function(){
                fixSidemenu();
                fixMegaMenu();
            });



        }

        /* Mega Menu Position Fix */
        function initMenuFeatures(){

            // navigation
            if($('#sidemenu').length == 0){
                var navigation = $('#main-nav');
                if(!navigation.length){
                    navigation = $('#header div.menu>ul');
                }
            }else{
                var navigation = $('#side-nav>ul');
            }

            var sidemenu = $('#sidemenu');
            if(sidemenu.length){

                // Sidemenu Overlaping Elements
                var sidenav = sidemenu.find('#side-nav');

                // Sidemenu Dropdown
                sidenav.find('>ul li').hover(function(){
                    var li = $(this);
                    if(!li.parents('.mega-menu').length && window_w > parseInt(mobilenav_screen_size)){
                        li.addClass('item-hovered');
                        li.find('>ul').slideDown(800, function(){
                            fixSidemenu('fade');
                        });
                    }
                }, function(){
                    var li = $(this);
                    if(!li.parents('.mega-menu').length){
                        li.removeClass('item-hovered');
                        setTimeout(function(){
                            if(!li.hasClass('item-hovered') && window_w > parseInt(mobilenav_screen_size)){
                                li.find('>ul').slideUp(800, function(){
                                    fixSidemenu('fade');
                                });
                            }
                        }, 1200);
                    }
                });

            }


            // Fix Mega Menu
            fixMegaMenu();
            fixSidemenu();

            /* Dropdowns */
            $('li', navigation).each(function(){

                if($(this).find('ul').length > 0){
                    $(this).append('<div class="dropdown-button"></div>');
                }

            });

            $('.dropdown-button', navigation).click(function(){

                $(this).parent().toggleClass('dropdown-opened').find('>ul').slideToggle(300);

            });




            // Menu Button
            $('#main-nav-button').click(function () {

                if ($(navigation).hasClass('nav-opened')) {

                    $(navigation).slideUp(300).removeClass('nav-opened');

                } else {

                    $(navigation).slideDown(300).addClass('nav-opened');

                }

            });


            // Sidenav Init
            $('#sidemenu-button').click(function(){
                var sidemenu = $('#sidemenu');
                var wrapper = $('#sidemenu-wrapper');

                sidemenu.toggleClass('menu-opened');
                wrapper.addClass('menu-mouse-out');
                setTimeout(function(){
                    if(wrapper.hasClass('menu-mouse-out')){
                        sidemenu.removeClass('menu-opened');
                    }
                }, 1000);

            });

            $('#sidemenu-wrapper').hover(function(){
                var wrapper = $(this);
                wrapper.addClass('menu-mouse-hover');
                wrapper.removeClass('menu-mouse-out');
            }, function(){
                var wrapper = $(this);
                wrapper.addClass('menu-mouse-out');
                wrapper.removeClass('menu-mouse-hover');
                if(wrapper.parent().hasClass('hidden-menu')){
                    setTimeout(function(){
                        if(wrapper.hasClass('menu-mouse-out')){
                            wrapper.parent().removeClass('menu-opened');
                        }
                    }, 600);
                }
            });
        }

        // FixSidemenu
        function fixSidemenu($animate){

            var animation = 0;
            if($animate == 'fade') animation = 300;
            var sidemenu = $('#sidemenu');
            if(sidemenu.length){

                // Sidemenu Overlaping Elements
                var sidenav = sidemenu.find('#side-nav');
                var sidetweets = sidemenu.find('.sidemenu-tweets');
                var sidefooter = sidemenu.find('.sidemenu-footer');

                var tweetsVisible = sidetweets.is(':visible');
                var footerVisible = sidefooter.is(':visible');

                var tAnimation = animation;
                var fAnimation = animation;

                if(!tweetsVisible) tAnimation = 0;
                if(!footerVisible) fAnimation = 0;

                // Reset Styles
                sidetweets.show();
                sidefooter.show();

                // Fix Overlaping
                if(sidetweets.length && sidefooter.length){

                    if( (sidenav.position().top + sidenav.outerHeight()) > sidefooter.position().top ){
                        sidetweets.fadeOut(tAnimation);
                        sidefooter.fadeOut(fAnimation);
                    }else if( (sidetweets.position().top + sidetweets.outerHeight()) > sidefooter.position().top ){
                        sidetweets.fadeOut(tAnimation);
                        if(!footerVisible)
                            sidefooter.hide().fadeIn(300);
                    }

                }else if(sidetweets.length){

                    if( (sidetweets.position().top + sidetweets.outerHeight()) > window_h ){
                        sidetweets.fadeOut(tAnimation);
                        if(!footerVisible)
                            sidefooter.hide().fadeIn(300);
                    }

                }else if(sidefooter.length){

                    if( (sidenav.position().top + sidenav.outerHeight()) > sidefooter.position().top ){
                        sidefooter.fadeOut(fAnimation);
                        if(!tweetsVisible)
                            sidetweets.hide().fadeIn(300);
                    }

                }else{
                    if(!tweetsVisible)
                        sidetweets.hide().fadeIn(300);
                    if(!footerVisible)
                        sidefooter.hide().fadeIn(300);
                }
            }

        }

        function fixMegaMenu(){
            // fix megamenu
            if($('#header .mega-menu').length != 0){
                $('#header .mega-menu').each(function(){

                    var el = $(this);

                    // Reset Styles
                    el.removeClass('mega-menu-too-big');
                    el.css('display','block');

                    // Calculate Width And Offset
                    var el_w = el.width();
                    var el_x = el.offset().left;

                    var container = $('#header .container');
                    var container_w = container.width();
                    var container_x = container.offset().left;

                    // Reset Positioning
                    el.css('left','').css('right','').css('margin-left','').css('display','');

                    // Fix Mega Menu Position
                    if(window_w > 768){

                        if( (el_x + el_w) > (container_x + container_w) )
                            el.css('right',0).css('margin-left','0px');
                        else if( el_x < container_x )
                            el.css('left',0).css('margin-left','0px');

                        if( el_w > container_w )
                            el.addClass('mega-menu-too-big');

                    }

                });
            }
        }





        /* Progressbars */

        function enableProgressbars() {

            $(window).bind('load resize scroll', function(){
                animateProgressBars();
            });

        }

        /* Animate Progress Bars */
        function animateProgressBars() {

            $('.progressbar').each(function () {

                var bar = $(this);
                var bar_y = $(bar).offset().top;

                if ((bar_y < (window_s + window_h)) && !$(bar).hasClass('progressbar-animating')) {

                    barStartAnimation(bar);
                    var other_bars = bar.parent().parent().find('.progressbar').not('.progressbar-animating');
                    other_bars.each(function(){
                            barStartAnimation($(this));
                    });

                }
            });


            /* Bar FillIn Animation */
            function barStartAnimation(el) {

                var bar = el;
                var bar_progress = el.find('.progress-width');
                var bar_percent = el.find('.progress-percent');

                bar.addClass('progressbar-animating').addClass('progessbar-start');
                bar_percent.fadeIn(200);
                var percent = parseInt($(bar).attr('data-percent'));

                bar_progress.animate(
                    {
                        width: percent+'%'
                    },
                    {
                        duration: 1000,
                        easing: 'swing',
                        step: function( now, fx ) {
                            bar_percent.text(parseInt(now) + '%').css('left', parseInt(now) + '%');
                        }
                    }
                );

            }

        }




        /* Circular Progressbar */

        function enableCircularProgressbars() {

            initCircularProgressbars();


            // Check If Knob Is In Viewport
            $(window).bind('scroll load resize', function(){

                $('.circular-progressbar').each(function(){

                    /* Knob Elements */
                    var knob = $(this);
                    var knob_percent = knob.parent().find('.knob-percent .knob-number');

                    /* Knob Variables */
                    var value = knob.data('value');
                    var knob_y = knob.offset().top;
                    var knob_val = knob.data('value');
                    var knob_animated = knob.hasClass('knob-animated');

                    /* Viewport Offset */
                    var viewport_offset = 0;

                    // Animate Knob If In Viewport
                    if((window_s + window_h - viewport_offset) > knob_y && !knob_animated){

                        knob.addClass('knob-animated');
                        $({startVal:0}).animate({startVal:knob_val},
                            {
                                duration: 3000,
                                easing:'linear',
                                step: function() {
                                    knob.val(Math.ceil(this.startVal)).trigger('change');
                                    //knob_percent.html(Math.ceil(this.startVal));
                                }
                            }
                        );

                        var knob_percent_v = 0;
                        var knob_inc = Math.round(knob_val / 30);
                        var knob_interval = setInterval(function(){

                            knob_percent_v += knob_inc;
                            if(knob_percent_v >= knob_val){
                                knob_percent_v = knob_val;
                                clearInterval(knob_interval);
                            }

                            knob_percent.html(knob_percent_v);

                        }, 100);

                    }

                });

            });

        }

        function initCircularProgressbars(){
            // Initialize Circular Progressbars
            $('.circular-progressbar').each(function() {

                var knob = $(this);

                // Set the value
                var value = knob.val();
                var knob_title = $(this).attr('data-title');
                knob.data('value', value);


                var text_color,
                    text_color_style;

                if (knob.attr('data-textcolor')) {
                    text_color = knob.attr('data-textcolor');
                    text_color_style = 'style="color: ' + text_color + '"';
                }

                // Initialize Knob
                knob.knob({
                    "min": 0,
                    "max": value
                });
                knob.val(0).trigger('change');
                knob.after('<p class="knob-percent" ' + text_color_style + '><span class="knob-number">0</span>' + knob_title + '</p>');

            });
        }


        // Enable MixItUp Filtering Plugin
        function enableMixItUp() {

            $('#projects-container').mixItUp();
            $('#sortable-shop-products').mixItUp();
            $('.faq-accordions').mixItUp();
            $('.projects-container').mixItUp({
                controls: {
                    enable: false
                }
            });

            $('.projects-container').parent().find('.filter[data-filter="all"]').addClass('active');
            $('.projects-container').parent().find('.filter').click(function(e){
                e.preventDefault();
                var cat = $(this).data('filter');
                $(this).parent().find('.active').removeClass('active');
                $(this).addClass('active');
                $(this).parent().parent().parent().find('.projects-container').mixItUp('filter', cat);
            });

        }

        function reinitializeMixItUp(){

            if($('#projects-container').mixItUp('isLoaded'))
                $('#projects-container').mixItUp('destroy');

            if($('#sortable-shop-products').mixItUp('isLoaded'))
                $('#sortable-shop-products').mixItUp('destroy');

            if($('.faq-accordions').mixItUp('isLoaded'))
                $('.faq-accordions').mixItUp('destroy');

            if($('.projects-container').mixItUp('isLoaded'))
                $('.projects-container').mixItUp('destroy');

            $('#projects-container').mixItUp();
            $('#sortable-shop-products').mixItUp();
            $('.faq-accordions').mixItUp();

            $('.projects-container').mixItUp({
                controls: {
                    enable: false
                }
            });

            $('.projects-container').parent().find('.filter[data-filter="all"]').addClass('active');
            $('.projects-container').parent().find('.filter').click(function(e){
                e.preventDefault();
                var cat = $(this).data('filter');
                $(this).parent().find('.active').removeClass('active');
                $(this).addClass('active');
                $(this).parent().parent().parent().find('.projects-container').mixItUp('filter', cat);
            });

        }



        /* Bootstrap Tooltips */
        function enableTooltips() {

            $('.hover-tooltip').tooltip();

			// Tooltip on TOP
			$('.tooltip-ontop').tooltip({
				placement: 'top'
			});

			// Tooltip on BOTTOM
			$('.tooltip-onbottom').tooltip({
				placement: 'bottom'
			});

			// Tooltip on LEFT
			$('.tooltip-onleft').tooltip({
				placement: 'left'
			});

			// Tooltip on RIGHT
			$('.tooltip-onright').tooltip({
				placement: 'right'
			});

        }


        // Alert Boxes
        function enableAlertBox() {

            $('.alert-box .close-button').click(function () {

                $(this).parent().slideUp(300);

            });

        }


        // Fancy box
        function enableFancyBox() {

            if ($('.fancybox').length > 0) {
                $(".fancybox").fancybox();
            }

        }


        // Masonry Blog
        function enableMasonryBlog() {

            var $container = $('.masonry-container');

            // Initialize
            initMasonryBlog();

			$(window).load(function(){
				$container.masonry('reload');
			});

        }

        function initMasonryBlog(){

            var $container = $('.masonry-container');

            // initialize
            $container.masonry({
                itemSelector: '.masonry-box'
            });

        }


        // Timeline Blog
        function enableTimelineBlog() {


            $(window).bind('load resize', function(){
                setTimelineBlog();
            });

			var timelineInterval = setInterval(function () {

				$('.timeline-container .masonry-box').each(function () {
					var el_x = $(this).offset().left;

					if (parseInt($(this).attr('data-left')) != el_x) {

						$(this).attr('data-left', el_x);
						setTimelineItem($(this));

					}
				});

			}, 100);

        }

        // Initialize Timeline Blog
        function setTimelineBlog() {

            $('.timeline-container').each(function () {

                if ($(this).hasClass('timeline-activated')) {

                    $(this).find('.masonry-box').each(function () {
                        setTimelineItem($(this));
                    });

                } else {

                    $(this).append('<div class="timeline-line"></div>');
                    $(this).addClass('timeline-activated');
                    $(this).find('.masonry-box').each(function () {
                        setTimelineItem($(this));
                    });

                }

            });

        }


        // Sets Timeline Items
        function setTimelineItem(element) {

            var item = element;
            var item_x = $(item).offset().left;
            var timeline_line_x = window_w/2;

            if (item_x < timeline_line_x) {

                $(item).addClass('left-timeline-item');
                $(item).removeClass('right-timeline-item');

            } else {

                $(item).addClass('right-timeline-item');
                $(item).removeClass('left-timeline-item');

            }

            $('.left-timeline-item, .right-timeline-item').bind('moveend', function () {

                alert('a');
                setTimelineBlog();

            });

        }



        // One Page Menu Item Scroll
        function enableOnePageScroll(){

        	var navigation = $('#main-nav');
			if(!navigation.length){
				navigation = $('#header div.menu>ul');
                if(!navigation.length){
                    navigation = $('#side-nav');
                }
            }

			$("a[href*=#]", navigation).add('a[href*=#]', '#slider').click(function(e) {
			    e.preventDefault();
                var target_hash = $(this).attr('href');
			    var target = $(target_hash);
			    if(target.length){
			    	var target_y = target.offset().top;
			    	$('html, body').animate(
                    {
                        scrollTop: target_y+'px'
                    },
                    {
                        duration: 1200,
                        easing: 'easeInOutCubic',
                        complete: function(){

                            if(history.pushState) {
                                history.pushState(null, null, target_hash);
                            }
                            else {
                                location.hash = target_hash;
                            }

                        }
                    });
			    }else if(target == '#'){
                    $('html, body').animate(
                        {
                            scrollTop: 0+'px'
                        },
                        {
                            duration: 1200,
                            easing: 'easeInOutCubic'
                        }
                    );
                }
			});

        }



        // Custom Audio Player
        function enableCustomAudio() {

            $(document).mouseup(function () {

                $('.audio-progress').attr('data-mousedown', '');
                $('.audio-volume').attr('data-mousedown', '');

            });

            initCustomAudio();

        }

        function initCustomAudio(){

            $('audio').each(function () {

                var audio = $(this)[0];
                audio.volume = 0.5;

                /* Setup Audio Player */
                $(this).wrap('<div class="audio-player"></div>');
                $(this).parent().append('<div class="audio-play-button"></div>');
                $(this).parent().append('<div class="audio-progress" data-mousedown=""><div class="audio-progress-bar"></div></div>');


                /* Playe/Pause button */
                $('.audio-play-button').click(function () {

                    if ($(this).hasClass('pause')) {
                        $(this).parent().find('audio')[0].pause();
                        $(this).removeClass('pause');
                    } else {
                        $(this).parent().find('audio')[0].play();
                        $(this).addClass('pause');
                    }

                });


                /* Progress update */
                $(this).bind('timeupdate', function () {

                    var track_length = $(this)[0].duration;
                    var secs = $(this)[0].currentTime;
                    var progress = (secs / track_length) * 100;

                    $(this).parent().find('.audio-progress-bar').css('width', progress + '%');

                    // Show play button again at the end
                    if (track_length == secs) {
                        $(this).parent().find('audio')[0].pause();
                        $(this).parent().find('.audio-play-button').removeClass('pause');
                    }

                });


                /* Progress click event */
                $('.audio-progress').click(function (e) {

                    var audio_x = $(this).offset().left;
                    var audio_w = $(this).width();
                    var mouse_x = e.pageX;

                    var progress = (mouse_x - audio_x) / audio_w * 100;

                    var track_length = $(this).parent().find('audio')[0].duration;
                    var update_time = track_length / (100 / progress);

                    $(this).parent().find('audio')[0].currentTime = update_time;

                });

                /* Progress drag event */

                $('.audio-progress').mousedown(function () {

                    $(this).attr('data-mousedown', 'true');

                });

                $('.audio-progress').mousemove(function (e) {

                    if ($(this).attr('data-mousedown') == 'true') {

                        var audio_x = $(this).offset().left;
                        var audio_w = $(this).width();
                        var mouse_x = e.pageX;

                        var progress = (mouse_x - audio_x) / audio_w * 100;

                        var track_length = $(this).parent().find('audio')[0].duration;
                        var update_time = track_length / (100 / progress);

                        $(this).parent().find('audio')[0].currentTime = update_time;

                    }

                });


                /* Volume */
                if ($(this).hasClass('volume-on')) {

                    $(this).parent().addClass('volume-on');
                    $(this).parent().append('<div class="audio-volume"><div class="audio-volume-bar"></div></div>');

                    /* Volume Click Event */
                    $('.audio-volume-bar').css('width', audio.volume * 100 + '%');
                    $('.audio-volume').click(function (e) {

                        var volume_x = $(this).offset().left;
                        var volume_w = $(this).width();
                        var mouse_x = e.pageX;

                        var new_volume = (mouse_x - volume_x) / volume_w;

                        $(this).find('.audio-volume-bar').css('width', new_volume * 100 + '%');
                        $(this).parent().find('audio')[0].volume = new_volume;

                    });


                    /* Volume Drag Event */

                    $('.audio-volume').mousedown(function () {

                        $(this).attr('data-mousedown', 'true');

                    });

                    $('.audio-volume').mousemove(function (e) {

                        if ($(this).attr('data-mousedown') == 'true') {

                            var volume_x = $(this).offset().left;
                            var volume_w = $(this).width();
                            var mouse_x = e.pageX;

                            var new_volume = (mouse_x - volume_x) / volume_w;

                            if (new_volume >= 0 && new_volume <= 1) {

                                $(this).find('.audio-volume-bar').css('width', new_volume * 100 + '%');
                                $(this).parent().find('audio')[0].volume = new_volume;

                            }

                        }

                    });

                }


            });

        }






		/**
         *   Slider Alternative Overlay
         */

        function enableSliderAlternativeOverlay(){
            sliderAlternativeOverlay();
            $(window).load(function(){
                sliderAlternativeOverlay();
            });
            $(window).resize(function(){
                sliderAlternativeOverlay();
            });
        }

    	function sliderAlternativeOverlay(){
    		$('.alternate-slider-bg').each(function(){

    			if(window_w > 991){
    				var el_h = $(this).innerHeight();
    				$(this).css('margin-top', -el_h+'px');
    			}else{
    				$(this).css('margin-top', 0);
    			}

    		});
    	}




        /**
         *   Timeline Load More
         */

        function enableTimelineLoadMore(){

            $.each($('.timeline-row .masonry-container'), function () {
                currentMonth = $(this).find('.col-md-6').attr('data-month');
                currentYear = $(this).find('.col-md-6').attr('data-year');
            });

            $('#timeline-load-more').click(function (e) {
                $this = $(this);
                $this.html('Loading Posts...');
                $.ajax({
                    url: templateUrl + '/ajax/timeline.php',
                    type: 'GET',
                    data: 'offset=' + timelineOffsetNext + '&posts_per_page=' + timelinePerPage + '&month=' + currentMonth + '&year=' + currentYear,
                    success: function (data) {

                        if (data == 0) {
                            $('#timeline-load-more').hide();
                        } else {
                            $('.timeline-container-wrap').append(data);
                            $('.masonry-container .timeline-line').remove();

                            $('.masonry-container').append('<div class="timeline-line"></div>');

                            enableTimelineBlog();

                            $this.html('Load More<i class="icons icon-spinner"> </i>');
                        }

                        timelineOffsetNext += timelinePerPage;
                        var $container = $('.masonry-container').masonry({
                            itemSelector: '.masonry-box'
                        });
                        $container.masonry('reload');

                        // Masonry Reload Fix (Animation Delay)
                        masonryFix = setTimeout(function(){
                            $container.masonry('reload');
                        }, 500);

                        $container.on('layoutComplete', function () {
                            return true;
                        });
                    }
                })
                e.preventDefault();
            });

        }


		/**
		 * Woocommerce load More Button
		 */

        function enableWooCommerceLoadMore(){

            var newWCElements = {};
            var $new_wc_items = '';
            newWCElements.loadElem = function($url) {

                $.ajax({
                    type: 'GET',
                    async: false,
                    url: $url,
                    success: function(data, textStatus, XMLHttpRequest){
                        $new_wc_items = $(data).find('#sortable-shop-products').html();
                        $next = $(data).find('#wc-load-more').attr('href');
                        if ($next) {
                            $('#wc-load-more').attr('href',$next);
                        } else {
                            $('#wc-load-more').slideUp();
                        }
                    },
                    error: function(MLHttpRequest, textStatus, errorThrown){
                        alert(errorThrown);
                    }
                });
                return $new_wc_items;
            };

            $('#wc-load-more').click(function(){

                var $newEls = $( newWCElements.loadElem($(this).attr('href')) ).hide();
                $('#sortable-shop-products').append( $newEls );
                $('#sortable-shop-products').find('.product').slideDown();
                return false;
            });

            $('#checkout-submit').click( function(e) {
                e.preventDefault();
                $('#cart-form').submit();
            });

            $('.sc-open-video').click( function(e) {
                e.preventDefault();
                $popup = $(this).closest('.sc-videp-popup-wrapper').find('.sc-video-popup');

                var $autoplay = '';

                if ($popup.data('autoplay') && $popup.data('autoplay') == 'yes') {

                    if ($popup.data('url').indexOf('?') == -1) {
                        $autoplay += '?';
                    } else if ($popup.data('url').indexOf('&amp;') == -1) {
                        $autoplay += '&amp;';
                    } else {
                        $autoplay += '&';
                    }
                    $autoplay += 'autoplay=1';
                }

                console.dir($popup.data('autoplay'));
                console.dir($popup.data('url') + $autoplay);

                $popup.prepend('<iframe src="' + $popup.data('url') + $autoplay + '"></iframe>');
                $popup.fadeIn(400);
            });

            $('.sc-close-video').click( function(e) {
                e.preventDefault();
                $(this).closest('.sc-video-popup').find('iframe').remove();
                $(this).closest('.sc-video-popup').fadeOut(400);
            });

        }



		/**
         * Woocommerce add to cart notification
         */

        function enableWooCommerceAddToCart(){

            var addi = {};

            if(!$('#added_items').length)
                $('body').append('<div id="added_items"></div>')

            function if_added(item) {
                if (item.hasClass('added')) {
                    var product_id = item.attr('data-product_id');
                    clearInterval(addi[product_id]);
                    item.find('.loader-container').remove();
                    $('#added_items').prepend('<div id="'+product_id+'" class="added_item"><img src="'+ item.parents('.product').find('.attachment-shop_catalog').attr('src') +'" alt=""/><p><b>"'+ item.parents('.product').find('.product-title').html() +'"</b> was added to the cart. </p><div class="clear"></div></div>');
                    $('#'+product_id).animate({opacity:1},500);
                    setTimeout(function(){
                      $('#'+product_id).animate({opacity:0,marginTop:20},500, function(){$(this).remove()});
                    },5000)
                }
            }

            $('.add_to_cart_button').each(function(){
                var add_btn = $(this);
                $(this).click(function(){
                    addi[$(this).attr('data-product_id')] = setInterval( function() {if_added(add_btn)},1000);
                    add_btn.append('<span class="loader-container"><span id="fountainG"><span id="fountainG_1" class="fountainG"></span><span id="fountainG_2" class="fountainG"></span><span id="fountainG_3" class="fountainG"></span><span id="fountainG_4" class="fountainG"></span><span id="fountainG_5" class="fountainG"></span><span id="fountainG_6" class="fountainG"></span><span id="fountainG_7" class="fountainG"></span><span id="fountainG_8" class="fountainG"></span></span></span>');
                });
            });

        }




		/**
         *  Masonry, Portfolio Load More Button
         */

        function enableLoadMoreButton(){

            $('#load-more').click(function(event){

                event.preventDefault();

                // Variables
                $url = $(this).attr('href');

                // Load Button Loading Text
                $load_more_text = $(this).html();
                $(this).html($(this).data('loading'));

                $.ajax({
                    type: 'GET',
                    url: $url,
                    success: function(data, textStatus, XMLHttpRequest) {

                        // Store New Data
                        var $new_items = $(data).find('#post-items').html();
                        var $next = $(data).find('#load-more').attr('href');

                        // update Load More Button Href
                        if ($next) {
                            $('#load-more').attr('href',$next);
                        } else {
                            $('#load-more').slideUp();
                        }

                        // Append new posts
                        $('#post-items').append($new_items);
                        $(".format-video").fitVids();
                        $(".project-item").show();

                        $('.post-image-gallery:not(".slider-enabled")').flexslider({
                            animation: "slide",
                            controlNav: false,
                            prevText: "",
                            nextText: "",
                        });

                        if ($('.masonry-container').length > 0) {
                            $('.masonry-container').masonry('reload');
                            setTimeout(function(){
                                $('.masonry-container').masonry('reload');
                            }, 400);
                        }

                    },
                    complete: function() {
                        $('#load-more').html($load_more_text);
                    },
                    error: function(MLHttpRequest, textStatus, errorThrown){
                        alert(errorThrown);
                    }
                });


            });

        }



        /**
         *  Post Like Option
         */

        function enablePostLike(){

            $('.project-like').click(function () {

                $post_id = $(this).attr('data-post');

                //end if clicked or cookie exists
                if ($('.post-liked', this).length > 0 || document.cookie.indexOf('saved_post_like_' + $post_id) != -1) {
                    return;
                }

                $('.like-count', this).animate({opacity:0}, 200, function(){
                    $(this).html(parseInt($(this).html()) + 1);
                    $(this).animate({opacity:1}, 200);
                });

                $(this).addClass('post-liked');

                $current_post_like = $('.like-count', this);

                $.ajax({
                    type: 'GET',
                    url: ajaxurl,
                    data: {
                        action: 'save_post_like',
                        post_id: $post_id
                    },
                    success: function (data, textStatus, XMLHttpRequest) {
                        $($current_post_like).html(data);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(errorThrown);
                    }
                });
            });

        }




        /**
         *  Enable Sharrre
         */

        function enableSharrre(){

            $('.sts-share').sharrre({
                share: {
                    googlePlus: true,
                    facebook: true,
                    twitter: true
                },
                buttons: {
                    googlePlus: {size: 'tall'},
                    facebook: {layout: 'box_count'},
                    twitter: {count: 'vertical'}
                },
                hover: function (api, options) {
                    $(api.element).find('.buttons').show();
                },
                hide: function (api, options) {
                    $(api.element).find('.buttons').hide();
                },


                url: 'http://www.paulund.co.uk/'
            });

        }




        /**
         *  Enable FitVids
         */

        function enableFitVids(){
            $(".format-video").fitVids();
        }



        /**
         *  Enable PrettyPhoto
         */

        function enablePrettyPhoto(){
           $("a.prettyPhoto").prettyPhoto();
        }





        /**
         * Contact Form AJAX
         */

        function enableAjaxContactForm(){

            // $('.contact-form').submit(function (e) {
            //     $this = $(this);
            //     $('input[type="submit"]', $this).val('Sending Message...');
            //     $.ajax({
            //         data: $(this).serialize(),
            //         type: 'POST',
            //         success: function (data) {

            //             obj = jQuery.parseJSON(data);
            //             if (obj.status == 0) {
            //                 $this.siblings('.msg').html('').addClass('alert-box alert-danger').html(obj.message);
            //                 $('input[type="submit"]', $this).val('Send Message');
            //             } else if (obj.status == 1) {
            //                 $this.fadeOut('slow');
            //                 $this.siblings('.msg').html('').addClass('alert-box alert-info').html(obj.message);
            //             }

            //         }
            //     })
            //     e.preventDefault();
            // });
        };
        if ($('.contact-form').length) {
            var messageDelay = 2000;
            $( init );
            function init() {
              $('.contact-form').submit( submitForm );
            };
            function submitForm() {
              var contactForm = $(this);
              if ( !$('.name').val() || !$('.email').val() || !$('.msg').val() ) {
                $('.incompleteMessage').slideDown().delay(messageDelay).slideUp();
              } else {
                $('.sendingMessage').slideDown();
                $.ajax( {
                  url: contactForm.attr( 'action' ) + "?ajax=true",
                  type: contactForm.attr( 'method' ),
                  data: contactForm.serialize(),
                  success: submitFinished
                } );
              };
              return false;
            };
            function submitFinished( response ) {
              response = $.trim( response );
              $('.sendingMessage').slideUp();

              if ( response == "success" ) {
                $('.successMessage').slideDown().delay(messageDelay).slideUp();
                $('.name').val( "" );
                $('.email').val( "" );
                $('.msg').val( "" );
              } else {
                $('.failureMessage').slideDown().delay(messageDelay).slideUp();
              }
            };
        };



        /**
         *  SUBSCRIBE FORM
         */
         function loading() {
            $('.subscribe-form-result').html('Submitting...').slideDown();
         };
         function formResult(data) {
            $('.subscribe-form-result').html(data);
            $('.subscribe-form input').val('');
         };
         function onSubmit() {
            $('.subscribe-form').submit(function() {
                var action = $(this).attr('action');
                loading();
                $.ajax({
                    url: action,
                    type: 'POST',
                    data: {
                    email: $('.subscribe-email').val()
                },
                success: function(data){
                    formResult(data);
                },
                error: function(data) {
                    formResult(data);
                }
            });
            return false;
         });
         }onSubmit();




        /**
         *  PARALLAX BACKGROUND
         */
        if ($('.parallax-bg').length) {
            $(window).on('load', function(){
                $('.parallax-bg').scrolly({bgParallax: true});
            })
        };


        /**
         *  LATEST TWEETS
         */
        if ($('.latest-tweets').length) {
            $('.latest-tweets .tweets-container').twittie({
                username: 'google',
                dateFormat: '%B %d, %Y',
                template: '<div class="tweet-wrapper"><div class="tweet-wrapper-inner"><p class="tweet-content">{{tweet}}<span class="tweet-date">{{date}}</span></div></div>',
                count: 10,
                hideReplies: true,
                apiPath: 'php/twitter-feed/tweet.php'
            }, function(){
                $('.tweets-container').children('ul').addClass('slides');
            });
        };



        /**
         *  Google Maps API
         */

        function enableGoogleMaps(){

            $('.sc-google-map').each(function(){

                // Get Map Settings
                var element = $(this),
                    element_native = element.get(0),
                    address = element.data('address'),
                    zoom = element.data('zoom'),
                    customMarker = element.data('custom-marker');
                    grayscaleEffect = element.data('grayscale') == 'yes' ? true : false;

                // Adjust Zoom
                zoom = zoom > 20 || zoom < 1 ? 14 : zoom;

                // Geocoder
                var geocoder = new google.maps.Geocoder(),
                    mapOptions = {
                        scrollwheel: false,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        center: new google.maps.LatLng(54.00, -3.00),
                        zoom: zoom
                    },
                    map = new google.maps.Map(element_native, mapOptions);

					if (grayscaleEffect === true) {
						var map_styles = [{
						  featureType: "all",
						  elementType: "all",
						  stylers: [
							{ saturation: -100 }
						  ]
						}];
						var mapType = new google.maps.StyledMapType(map_styles, { name:"Grayscale" });
						map.mapTypes.set('grayscale_map', mapType);
						map.setMapTypeId('grayscale_map');
					}

                geocoder.geocode({"address": address}, function(results, status) {
                    if(status == google.maps.GeocoderStatus.OK)
                    {
                        result = results[0].geometry.location;
                        map.setCenter(result);

                        // Marker Options
                        var markerOptions = {
                            position: result,
                            map: map,
                            title: address
                        }

                        // CustomMarker Icon
                        if(customMarker != ''){
                            markerOptions.icon = customMarker;
                        }

                        // Initialize Marker
                        var marker = new google.maps.Marker(markerOptions);
                    }
                });

            });

        }


        if ($('#wpgmappity-map-4').length){
            function wpgmappity_maps_loaded4() {
            var latlng = new google.maps.LatLng(51.5466757,-0.20884019999994);
            var options = {
              center : latlng,
              scrollwheel :  false,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoomControl : false,
              mapTypeControl : false,
              scaleControl : false,
              streetViewControl : false,
              panControl : false,  zoom : 15
            };
            var wpgmappitymap4 = new google.maps.Map(document.getElementById('wpgmappity-map-4'), options);
            var point0 = new google.maps.LatLng(51.5466757,-0.2088402);
            var marker4_0 = new google.maps.Marker({
              icon : 'img/Shape-158-copy-3.png',
              position : point0,
              map : wpgmappitymap4
              });
            }
            jQuery(window).load(function() {
              wpgmappity_maps_loaded4();
            });
        };


        if ($('#wpgmappity-map-1').length){
            function wpgmappity_maps_loaded1() {
            var latlng = new google.maps.LatLng(51.5466757,-0.2088402);
            var options = {
              center : latlng,
              scrollwheel :  false,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoomControl : false,
              mapTypeControl : false,
              scaleControl : false,
              streetViewControl : false,
              panControl : false,  zoom : 16
            };
            var wpgmappitymap1 = new google.maps.Map(document.getElementById('wpgmappity-map-1'), options);
            var point0 = new google.maps.LatLng(51.5466757,-0.2088402);
            var marker1_0 = new google.maps.Marker({
              icon : 'img/marker_red.png',
              position : point0,
              map : wpgmappitymap1
              });
            }
            jQuery(window).load(function() {
              wpgmappity_maps_loaded1();
            });
        };

        if ($('#wpgmappity-map-7').length){
            function wpgmappity_maps_loaded7() {
            var latlng = new google.maps.LatLng(51.5466757,-0.2088402);
            var options = {
              center : latlng,
              scrollwheel :  false,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoomControl : false,
              mapTypeControl : false,
              scaleControl : false,
              streetViewControl : false,
              panControl : false,  zoom : 16
            };
            var wpgmappitymap7 = new google.maps.Map(document.getElementById('wpgmappity-map-7'), options);
            var point0 = new google.maps.LatLng(51.5466757,-0.2088402);
            var marker7_0 = new google.maps.Marker({
              icon : 'img/foodmapmarker.png',
              position : point0,
              map : wpgmappitymap7
              });
            }
            jQuery(window).load(function() {
              wpgmappity_maps_loaded7();
            });
        };




        /**
         * AJAX Page Load
         */

        function enableAjaxPageLoad(){

            if($body.hasClass('page_transitions_enabled')){
                initAjaxNav();

                // Enable Ajax Page Load
                if(history.pushState){

                    window.onpopstate = function(){

                        var target = location.pathname;
                        if(ionic_current_path != target){
                            loadPageAJAX(target);
                        }
                        ionic_current_path = target;

                    }

                }
            }

        }


        function initAjaxNav(){

            // Get Main Navigation
            if($('#sidemenu').length > 0){
                var $navigation = $('#side-nav');
            }else{
                var $navigation = $('#main-nav');
                if(!$navigation.length > 0){
                    $navigation = $('#header div.menu>ul');
                }
            }

            if(history.pushState){
                $navigation.find('a').not('a[href*=#]').click(function(e){

                    e.preventDefault();
                    var target = $(this).attr('href');

                    if(document.URL != target){
                        loadPageAJAX(target);
                        history.pushState(null, null, target);
                    }

                });
            }

        }


        // Load Page AJAX
        function loadPageAJAX(target){

            var target = target,
                scrollTop = $(document).scrollTop(),
                scrollDuration;

            ionic_current_path = target;

            if(scrollTop > 200)
                scrollDuration = 800;
            else if(scrollTop < 200 && scrollTop != 0)
                scrollDuration = 300;
            else if(scrollTop == 0)
                scrollDuration = 0;

            $('body, html').animate({scrollTop:0}, scrollDuration);

            setTimeout(function(){

                $('.page-loadingstage').addClass('visible');

                setTimeout(function(){

                    $.ajax({
                        type:'post',
                        async: true,
                        data:{},
                        url:target,
                        success:function(response){

                            $("body").attr("class", /body([^>]*)class=(["']+)([^"']*)(["']+)/gi.exec(response.substring(response.indexOf("<body"), response.indexOf("</body>") + 7))[3]);

                            // Load Marine Content
                            var marineContent = $(response).filter('#marine-content-wrapper').html();
                            $('#marine-content-wrapper').html(marineContent);

                            // Set New Title
                            document.title = $(response).filter('title').text();


                            $('style').remove();
                            $(response).filter('style').each(function(){
                                $('head').append($(this));
                            });

                            // Load WordpresAdminBar
                            var wpAdminBar = $(response).filter('#wpadminbar').html();
                            if(wpAdminBar){
                                $('#wpadminbar').html(wpAdminBar);
                            }

                            reinitializeAllFeatures();

                            setTimeout(function(){
                                $('.page-loadingstage').removeClass('visible');
                                $(window).trigger('load');
                                $(window).trigger('resize');
                            }, 1200);
                        },
                        error: function(MLHttpRequest, textStatus, errorThrown){
                            window.location = target;
                        }
                    });

                }, 600);

            }, scrollDuration);


        }



        /**
         *  Set Full Width
         */
        function enableFullWidth(){

            setFullWidth();

            // Set Full Width on Resize & Load
            $(window).bind("resize", function(){

                setFullWidth();
                setTimeout(function(){
                    setFullWidth();
                }, 400);

            });

        }

        // Set Full Width Function
        function setFullWidth(){

            if(!$("body").hasClass("b960") && !$("body").hasClass("b1170")){
                $(".full-width").each(function(){

                    var element = $(this);

                    // Reset Styles
                    element.css("margin-left", "");
                    element.css("padding-left", "0!important");
                    element.css("width", "");

                    var element_x = element.offset().left;

                    // Set New Styles
                    element.css("margin-left", -element_x+"px");
                    element.css("width", $(window).width()+"px");
                    element.css("padding-left", "");

                });
            }

        }

	});

})(jQuery);