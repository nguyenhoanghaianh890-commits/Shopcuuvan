"use strict";

// Advanced Lazy Loading with Intersection Observer
// Optimized for large images and GIFs to prevent website lag
(function() {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                if (src) {
                    // Create new image to preload
                    const preloadImg = new Image();
                    preloadImg.onload = function() {
                        img.src = src;
                        img.classList.add('loaded');
                        if (img.parentElement) {
                            img.parentElement.classList.add('loaded-done');
                        }
                    };
                    preloadImg.src = src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px 0px', // Start loading 100px before entering viewport
        threshold: 0.01
    });

    // Initialize lazy loading when DOM is ready
    function initLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLazyImages);
    } else {
        initLazyImages();
    }

    // Also re-check after owl carousel initializes (for dynamically added images)
    document.addEventListener('owlCarouselInitialized', initLazyImages);

    // Re-observe new images added dynamically
    window.initLazyImages = initLazyImages;
})();

updateFlashDealProgressBar();
setInterval(updateFlashDealProgressBar, 10000);

$(document).ready(function() {
    var directionFromSession = $("#direction-from-session").data("value");
    directionFromSession = directionFromSession === 'rtl' ? true : false;

    $(".flash-deal-slider").owlCarousel({
        loop: false,
        autoplay: true,
        center: false,
        margin: 10,
        nav: true,
        navText: directionFromSession === "rtl" ?
            [
                "<i class='czi-arrow-right'></i>",
                "<i class='czi-arrow-left'></i>",
            ] :
            [
                "<i class='czi-arrow-left'></i>",
                "<i class='czi-arrow-right'></i>",
            ],
        dots: false,
        autoplayHoverPause: true,
        rtl: directionFromSession === "rtl",
        ltr: directionFromSession === "ltr",
        responsive: {
            0: {
                items: 1.1,
            },
            360: {
                items: 1.2,
            },
            375: {
                items: 1.4,
            },
            480: {
                items: 1.8,
            },
            576: {
                items: 2,
            },
            768: {
                items: 3,
            },
            992: {
                items: 4,
            },
            1200: {
                items: 4,
            },
        },
    });

    $(".flash-deal-slider-mobile").owlCarousel({
        loop: true,
        autoplay: true,
        center: true,
        margin: 10,
        nav: true,
        navText: directionFromSession === "rtl" ?
            [
                "<i class='czi-arrow-right'></i>",
                "<i class='czi-arrow-left'></i>",
            ] :
            [
                "<i class='czi-arrow-left'></i>",
                "<i class='czi-arrow-right'></i>",
            ],
        dots: false,
        autoplayHoverPause: true,
        rtl: directionFromSession === "rtl",
        ltr: directionFromSession === "ltr",
        responsive: {
            0: {
                items: 1.1,
            },
            360: {
                items: 1.2,
            },
            375: {
                items: 1.4,
            },
            480: {
                items: 1.8,
            },
            576: {
                items: 2,
            },
            768: {
                items: 3,
            },
            992: {
                items: 4,
            },
            1200: {
                items: 4,
            },
        },
    });

    let featuredProductsLoopEnable = $('#featured_products_list').data('loop')?.toString() === 'true';
    $("#featured_products_list").owlCarousel({
        loop: featuredProductsLoopEnable,
        autoplay: true,
        margin: 20,
        nav: true,
        navText: directionFromSession === "rtl" ?
            [
                "<i class='czi-arrow-right'></i>",
                "<i class='czi-arrow-left'></i>",
            ] :
            [
                "<i class='czi-arrow-left'></i>",
                "<i class='czi-arrow-right'></i>",
            ],
        dots: false,
        autoplayHoverPause: true,
        rtl: directionFromSession === "rtl",
        ltr: directionFromSession === "ltr",
        responsive: {
            0: {
                items: 1,
            },
            360: {
                items: 1,
            },
            375: {
                items: 1,
            },
            540: {
                items: 2,
            },
            576: {
                items: 2,
            },
            768: {
                items: 3,
            },
            992: {
                items: 4,
            },
            1200: {
                items: 6,
            },
        },
    });

    $(".new-arrivals-product").owlCarousel({
        loop: true,
        autoplay: true,
        margin: 20,
        nav: true,
        navText: directionFromSession === "rtl" ?
            [
                "<i class='czi-arrow-right'></i>",
                "<i class='czi-arrow-left'></i>",
            ] :
            [
                "<i class='czi-arrow-left'></i>",
                "<i class='czi-arrow-right'></i>",
            ],
        dots: false,
        autoplayHoverPause: true,
        rtl: directionFromSession === "rtl",
        ltr: directionFromSession === "ltr",
        responsive: {
            0: {
                items: 1,
            },
            360: {
                items: 1.02,
            },
            375: {
                items: 1.02,
            },
            540: {
                items: 2,
            },
            576: {
                items: 2,
            },
            768: {
                items: 2,
            },
            992: {
                items: 2,
            },
            1200: {
                items: 4,
            },
            1400: {
                items: 4,
            },
        },
    });

    $(".category-wise-product-slider").each(function() {
        let loopEnable = $(this).data('loop')?.toString() === 'true';

        $(this).owlCarousel({
            loop: loopEnable,
            autoplay: true,
            margin: 20,
            nav: true,
            navText: directionFromSession === "rtl" ?
                [
                    "<i class='czi-arrow-right'></i>",
                    "<i class='czi-arrow-left'></i>",
                ] :
                [
                    "<i class='czi-arrow-left'></i>",
                    "<i class='czi-arrow-right'></i>",
                ],
            dots: false,
            autoplayHoverPause: true,
            rtl: directionFromSession === "rtl",
            ltr: directionFromSession === "ltr",
            responsive: {
                0: {
                    items: 1.2,
                },
                375: {
                    items: 1.4,
                },
                425: {
                    items: 2,
                },
                576: {
                    items: 3,
                },
                768: {
                    items: 4,
                },
                992: {
                    items: 5,
                },
                1200: {
                    items: 6,
                },
            },
            onInitialized: checkNavigationButtons,
        });
    });

    function checkNavigationButtons(event) {
        var itemCount = event.item.count;
        let owlNav = $(".owl-nav");
        itemCount > 1 ? owlNav.show() : owlNav.hide();
    }

    let isLoopHeroSlider = $(".hero-slider").data('loop')?.toString() === '1';

    $(".hero-slider").owlCarousel({
        loop: isLoopHeroSlider,
        autoplay: isLoopHeroSlider,
        margin: 20,
        nav: isLoopHeroSlider,
        navText: directionFromSession === "rtl" ?
            [
                "<i class='czi-arrow-right'></i>",
                "<i class='czi-arrow-left'></i>",
            ] :
            [
                "<i class='czi-arrow-left'></i>",
                "<i class='czi-arrow-right'></i>",
            ],
        dots: isLoopHeroSlider,
        autoplayHoverPause: isLoopHeroSlider,
        autoplaySpeed: 1500,
        slideTransition: "linear",
        items: 1,
        rtl: directionFromSession === "rtl",
        ltr: directionFromSession === "ltr",
    });

    $(".brands-slider").owlCarousel({
        loop: false,
        autoplay: true,
        margin: 10,
        nav: true,
        navText: directionFromSession === "rtl" ?
            [
                "<i class='czi-arrow-right'></i>",
                "<i class='czi-arrow-left'></i>",
            ] :
            [
                "<i class='czi-arrow-left'></i>",
                "<i class='czi-arrow-right'></i>",
            ],
        dots: false,
        rtl: directionFromSession === "rtl",
        ltr: directionFromSession === "ltr",
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 4,
            },
            360: {
                items: 5,
            },
            576: {
                items: 6,
            },
            768: {
                items: 7,
            },
            992: {
                items: 9,
            },
            1200: {
                items: 11,
            },
            1400: {
                items: 12,
            },
        },
    });

    $(".footer-banner-slider").owlCarousel({
        loop: true,
        autoplay: true,
        margin: 10,
        nav: false,
        rtl: directionFromSession === "rtl",
        ltr: directionFromSession === "ltr",
        autoplayHoverPause: true,
        items: 1,
    });

    $("#category-slider, #top-seller-slider").owlCarousel({
        loop: false,
        autoplay: true,
        margin: 20,
        nav: false,
        dots: true,
        autoplayHoverPause: true,
        rtl: directionFromSession === "rtl",
        ltr: directionFromSession === "ltr",
        responsive: {
            0: {
                items: 2,
            },
            360: {
                items: 3,
            },
            375: {
                items: 3,
            },
            540: {
                items: 4,
            },
            576: {
                items: 5,
            },
            768: {
                items: 6,
            },
            992: {
                items: 8,
            },
            1200: {
                items: 10,
            },
            1400: {
                items: 11,
            },
        },
    });

    $(".categories--slider").owlCarousel({
        loop: false,
        autoplay: true,
        margin: 20,
        nav: false,
        dots: false,
        autoplayHoverPause: true,
        rtl: directionFromSession === "rtl",
        ltr: directionFromSession === "ltr",
        responsive: {
            0: {
                items: 3,
            },
            // 360: {
            //     items: 3.2,
            // },
            // 375: {
            //     items: 3.5,
            // },
            540: {
                items: 4,
            },
            576: {
                items: 5,
            },
            768: {
                items: 6,
            },
            992: {
                items: 8,
            },
            1200: {
                items: 10,
            },
            1400: {
                items: 11,
            },
        },
    });

    const othersStore = $(".others-store-slider").owlCarousel({
        responsiveClass: true,
        nav: false,
        dots: false,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        smartSpeed: 600,
        rtl: directionFromSession === "rtl",
        ltr: directionFromSession === "ltr",
        responsive: {
            0: {
                items: 1.3,
                margin: 10,
            },
            480: {
                items: 2,
                margin: 26,
            },
            768: {
                items: 2,
                margin: 26,
            },
            992: {
                items: 3,
                margin: 26,
            },
            1200: {
                items: 4,
                margin: 26,
            },
        },
    });

    $(".store-next").on("click", function() {
        othersStore.trigger("next.owl.carousel", [600]);
    });

    $(".store-prev").on("click", function() {
        othersStore.trigger("prev.owl.carousel", [600]);
    });
});