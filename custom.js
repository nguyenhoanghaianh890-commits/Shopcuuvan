"use strict";

(function($) {
    $(".profile-aside-btn").on("click", function() {
        $("#shop-sidebar, .profile-aside-overlay").toggleClass("active");
    });
    $(".profile-aside-close-btn, .profile-aside-overlay").on(
        "click",
        function() {
            $("#shop-sidebar, .profile-aside-overlay").removeClass("active");
        }
    );

    $(".stopPropagation").on("click", function(e) {
        e.stopPropagation();
    });
    $('[data-toggle="tooltip"]').tooltip();
})(jQuery);

$(document).ready(function() {
    const stickyElement = $(".bottom-sticky_ele");
    const offsetElement = $(".bottom-sticky_offset");

    if (stickyElement.length !== 0) {
        $(window).on("scroll", function() {
            const elementOffset =
                offsetElement.offset().top - $(window).height() / 1.2;
            const scrollTop = $(window).scrollTop();

            if (scrollTop >= elementOffset) {
                stickyElement.addClass("stick");
            } else {
                stickyElement.removeClass("stick");
            }
        });
    }

    getReferralCodeFromURL();
    renderOfferBarFunction("#announcement");

    /*==================================
    19: Changing svg color
    ====================================*/
    $("img.svg").each(function() {
        var $img = jQuery(this);
        var imgID = $img.attr("id");
        var imgClass = $img.attr("class");
        var imgURL = $img.attr("src");

        jQuery.get(
            imgURL,
            function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find("svg");

                // Add replaced image's ID to the new SVG
                if (typeof imgID !== "undefined") {
                    $svg = $svg.attr("id", imgID);
                }
                // Add replaced image's classes to the new SVG
                if (typeof imgClass !== "undefined") {
                    $svg = $svg.attr("class", imgClass + " replaced-svg");
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr("xmlns:a");

                // Check if the viewport is set, else we gonna set it if we can.
                if (!$svg.attr("viewBox") &&
                    $svg.attr("height") &&
                    $svg.attr("width")
                ) {
                    $svg.attr(
                        "viewBox",
                        "0 0 " + $svg.attr("height") + " " + $svg.attr("width")
                    );
                }
                // Replace image with new SVG
                $img.replaceWith($svg);
            },
            "xml"
        );
    });
});

function renderOfferBarFunction(sectionSelector) {
    let hideUntil = localStorage.getItem("offerBarHideUntil");
    if (hideUntil) {
        let currentTime = Date.now();
        if (currentTime < hideUntil) {
            $(sectionSelector).slideUp("fast");
        } else {
            $(sectionSelector).slideDown("fast");
            localStorage.removeItem("offerBarHideUntil");
        }
    } else {
        $(sectionSelector).slideDown("fast");
    }
}


$(".get-currency-change-function").on("click", function() {
    let code = $(this).data("code");
    currencyChangeFunction(code);
});



function getReferralCodeFromURL() {
    let getAuthStatus = $("#is-customer-auth-active").data("value");
    if (getAuthStatus == 0) {
        const currentUrl = new URL(window.location.href);
        const referralCodeParameter = new URLSearchParams(
            currentUrl.search
        ).get("referral_code");
        if (referralCodeParameter) {
            let referralCodeInput = $("#referral_code");
            if ($("#is-request-customer-auth-sign-up").data("value")) {
                if (referralCodeInput.length) {
                    referralCodeInput.val(referralCodeParameter);
                }
            } else {
                let redirectLink = $("#route-customer-auth-sign-up").data(
                    "url"
                );
                window.location.href =
                    redirectLink +
                    "?referral_code=" +
                    referralCodeParameter;
            }
        }
    }
}

$(".web-announcement-slideUp").on("click", function() {
    $("#announcement").slideUp(300);
    let hideUntil = Date.now() + 300000;
    localStorage.setItem("offerBarHideUntil", hideUntil);
});

$(".category-menu-toggle-btn").on("click", function() {
    $(".megamenu-wrap").toggleClass("show");
});

$(".navbar-tool-icon-box").on("click", function() {
    $(".megamenu-wrap").removeClass("show");
});

$(window).on("scroll", function() {
    $(".megamenu-wrap").removeClass("show");
});

$(".close-search-form-mobile").on("click", function() {
    $(".search-form-mobile").removeClass("active");
});
$(".open-search-form-mobile").on("click", function() {
    $(".search-form-mobile").addClass("active");
});

$(".get-view-by-onclick").on("click", function() {
    location.href = $(this).data("link");
});

$(".get-login-recaptcha-verify").on("click", function() {
    let url = $(this).data("link");
    customerLoginRecaptcha(url);
});
$(".get-login-verify-recaptcha-verify").on("click", function() {
    let url = $(this).data("link");
    customerLoginVerifyRecaptcha(url);
});

function customerLoginVerifyRecaptcha(url) {
    url =
        url +
        "/" +
        Math.random() +
        "?captcha_session_id=default_recaptcha_id_customer_login_verify";
    document.getElementById("customer_login_verify_recaptcha_id").src = url;
}

function customerLoginRecaptcha(url) {
    url =
        url +
        "/" +
        Math.random() +
        "?captcha_session_id=default_recaptcha_id_customer_login";
    document.getElementById("customer_login_recaptcha_id").src = url;
}

$(".get-regi-recaptcha-verify").on("click", function() {
    let url = $(this).data("link");
    customerRegiRecaptcha(url);
});
$(".get-seller-regi-recaptcha-verify").on("click", function() {
    let url = $(this).data("link");
    let genUrl = url.replace(":dummy-id", Math.random());
    sellerRegiRecaptcha(genUrl);
});

function sellerRegiRecaptcha(url) {
    url = url + "?captcha_session_id=vendorRecaptchaSessionKey";
    let inputElement = $('#default_recaptcha_id');
    if (inputElement?.length > 0) {
        inputElement.attr('src', url);
    }
}

function customerRegiRecaptcha(url) {
    url =
        url +
        "/" +
        Math.random() +
        "?captcha_session_id=default_recaptcha_id_customer_regi";
    document.getElementById("default_recaptcha_id").src = url;
}

$(".get-vendor-regi-recaptcha-verify").on("click", function() {
    let genUrl = $(this).data("link");
    genUrl = genUrl.replace(":dummy-id", Math.random());
    vendorRegiRecaptcha(genUrl);
});

function vendorRegiRecaptcha(url) {
    let genUrl = url + "?captcha_session_id=default_recaptcha_id_seller_registration";
    document.getElementById("default_recaptcha_id").src = genUrl;

}

$("#inputChecked").change(function() {
    if ($(this).is(":checked")) {
        $("#sign-up").removeAttr("disabled");
    } else {
        $("#sign-up").attr("disabled", "disabled");
    }
});

$(".submitVerifyForm").on("click", function() {
    let formElement = $(this).closest("form");
    formElement.attr("action", formElement.data("verify"));
    $(this).closest("form").submit();
});

$(".resendVerifyForm").on("click", function() {
    let formElement = $(this).closest("form");
    formElement.attr("action", formElement.data("resend"));
    $(this).closest("form").submit();
});

// $(".resendVerifyForm").on('click', function () {
//     $("input.otp-field").val("");
//     $.ajaxSetup({
//         headers: {
//             "X-CSRF-TOKEN": $('meta[name="_token"]').attr("content"),
//         },
//     });
//     $.ajax({
//         url: $(this).data("url"),
//         method: "POST",
//         dataType: "json",
//         data: {
//             user_id: $(this).data("userid"),
//         },
//         beforeSend: function () {
//             $("#loading").show();
//         },
//         success: function (data) {
//             if (data.status == 1) {
//                 let new_counter = $(".verifyCounter");
//                 let new_seconds = data.new_time;

//                 function new_tick() {
//                     let minutes = Math.floor(new_seconds / 60);
//                     let seconds = new_seconds % 60;
//                     new_seconds--;
//                     new_counter.html(
//                         minutes +
//                             ":" +
//                             (seconds < 10 ? "0" : "") +
//                             String(seconds)
//                     );
//                     if (new_seconds > 0) {
//                         setTimeout(new_tick, 1000);
//                         $(".resend-otp-button").attr("disabled", true);
//                         $(".resend_otp_custom").slideDown();
//                     } else {
//                         $(".resend-otp-button").removeAttr("disabled");
//                         new_counter.html("0:00");
//                         $(".resend_otp_custom").slideUp();
//                     }
//                 }

//                 new_tick();

//                 toastr.success($("#message-otp-sent-again").data("text"));
//             } else {
//                 toastr.error($("#message-wait-for-new-code").data("text"));
//             }
//         },
//         complete: function () {
//             $("#loading").hide();
//         },
//     });
// });

$(".get-contact-recaptcha-verify").on("click", function() {
    let url = $(this).data("link");
    url = url + "/" + Math.random();
    document.getElementById("default_recaptcha_id").src = url;
});

$(".check-password-match").on("change", function() {
    checkPasswordMatch();
});

function checkPasswordMatch() {
    let password = $("#password").val();
    let confirmPassword = $("#confirm_password").val();
    let messageElement = $("#message");
    messageElement.removeAttr("style");
    messageElement.html("");
    if (confirmPassword === "") {
        messageElement.attr("style", "color:black");
        messageElement.html($("#message-please-retype-password").data("text"));
    } else if (password === "") {
        messageElement.removeAttr("style");
        messageElement.html("");
    } else if (password !== confirmPassword) {
        messageElement.html($("#message-password-not-match").data("text"));
        messageElement.attr("style", "color:red");
    } else if (confirmPassword.length <= 6) {
        messageElement.html($("#message-password-need-longest").data("text"));
        messageElement.attr("style", "color:red");
    } else {
        messageElement.html($("#message-password-match").data("text"));
        messageElement.attr("style", "color:green");
    }
}

$(document).ready(function() {
    $("#confirm_password").keyup(checkPasswordMatch);
});

function accountImageReadURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $("#blah").attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$("#files").change(function() {
    accountImageReadURL(this);
});

$(".update-account-info").on("click", function() {
    $("#profile_form").submit();
});

$(".call-route-alert").on("click", function() {
    let route = $(this).data("route");
    let message = $(this).data("message");
    route_alert(route, message);
});

$(".filter-ico-button").on("click", function() {
    $(".__shop-page-sidebar").toggleClass("active");
});

$(".shop-page-sidebar-close").on("click", function() {
    $(".__shop-page-sidebar").removeClass("active");
});

$(".action-sort-shop-products-by-data").on("change", function() {
    sortShopProductsByData($(this).val());
});

$(".menu--caret").on("click", function(e) {
    var element = $(this).closest(".menu--caret-accordion");
    if (element.hasClass("open")) {
        element.removeClass("open");
        element.find(".menu--caret-accordion").removeClass("open");
        element.find(".card-body").slideUp(300, "swing");
    } else {
        element.addClass("open");
        element.children(".card-body").slideDown(300, "swing");
        element
            .siblings(".menu--caret-accordion")
            .children(".card-body")
            .slideUp(300, "swing");
        element.siblings(".menu--caret-accordion").removeClass("open");
        element
            .siblings(".menu--caret-accordion")
            .find(".menu--caret-accordion")
            .removeClass("open");
        element
            .siblings(".menu--caret-accordion")
            .find(".card-body")
            .slideUp(300, "swing");
    }
});


$(".rating-label-wrap input[type=range]").on("change", function() {
    let ratingVal = $(this).val();
    let ratingContent = $(".rating_content_delivery_man");
    let rattingTextAreaClass = $(".text-area-class");
    let rattingMessages = $("#message-ratingContent");
    let htmlDir = $("#system-session-direction").data("value");
    let position = "left";
    if (htmlDir === "rtl") {
        position = "right";
    }
    switch (ratingVal) {
        case "1":
            ratingContent
                .text(rattingMessages.data("poor"))
                .css(position, "5px");
            rattingTextAreaClass.attr("placeholder", "");
            break;
        case "2":
            ratingContent
                .text(rattingMessages.data("average"))
                .css(position, "36px");
            rattingTextAreaClass.attr("placeholder", "");
            break;
        case "3":
            ratingContent
                .text(rattingMessages.data("good"))
                .css(position, "85px");
            rattingTextAreaClass.attr(
                "placeholder",
                rattingMessages.data("good-message")
            );
            break;
        case "4":
            ratingContent
                .text(rattingMessages.data("good2"))
                .css(position, "112px");
            rattingTextAreaClass.attr(
                "placeholder",
                rattingMessages.data("good2-message")
            );
            break;
        case "5":
            ratingContent
                .text(rattingMessages.data("excellent"))
                .css(position, "155px");
            rattingTextAreaClass.attr(
                "placeholder",
                rattingMessages.data("excellent-message")
            );
            break;
        default:
            break;
    }
});



$(".customer-account-delete-by-route").on("click", function() {
    $("#shop-sidebar").removeClass("active");
    $(".profile-aside-overlay ").removeClass("active");
    let route = $(this).data("route");
    let message = $(this).data("message");
    route_alert(route, message);
});

$(".show-instant-image").on("click", function() {
    let link = $(this).data("link");
    showInstantImage(link);
});

function showInstantImage(link) {
    $("#attachment-view").attr("src", link);
    $("#show-modal-view").modal("toggle");
}

$(".password-toggle-btn").on("click", function() {
    let checkbox = $(this).find("input[type=checkbox]");
    let eyeIcon = $(this).find("i");
    checkbox.change(function() {
        if (checkbox.is(":checked")) {
            eyeIcon.removeClass("tio-hidden").addClass("tio-invisible");
        } else {
            eyeIcon.removeClass("tio-invisible").addClass("tio-hidden");
        }
    });
});

$(".filter-show-btn").on("click", function() {
    $("#shop-sidebar").toggleClass("show active");
});

$(".cz-sidebar-header .close").on("click", function() {
    $("#shop-sidebar").removeClass("show active");
});

$(".remove-address-by-modal").on("click", function() {
    let link = $(this).data("link");
    $("#remove-address-link").attr("href", link);
    $("#remove-address").modal("show");
});

var backgroundImage = $("[data-bg-img]");
backgroundImage
    .css("background-image", function() {
        return 'url("' + $(this).data("bg-img") + '")';
    })
    .removeAttr("data-bg-img")
    .addClass("bg-img");

$(".get-order-again-function").on("click", function() {
    let orderId = $(this).data("id");
    order_again(orderId);
});

$(".search-bar-input-mobile").keyup(function() {
    $(".search-card").css("display", "block");
    let name = $(".search-bar-input-mobile").val();
    if (name.length > 0) {
        $.get({
            url: $("#route-searched-products").data("url"),
            dataType: "json",
            data: {
                name: name,
            },
            beforeSend: function() {
                $("#loading").show();
            },
            success: function(data) {
                $(".search-result-box").empty().html(data.result);
                $(".search-result-product").on("mouseover", function() {
                    $(".search-bar-input-mobile").val(
                        $(this).data("product-name")
                    );
                });
            },
            complete: function() {
                $("#loading").hide();
            },
        });
    } else {
        $(".search-result-box").empty();
    }
});

$(".search-bar-input").keyup(function() {
    let searchBarInputElement = $(".search-bar-input");
    $(".search-card").css("display", "block");
    let name = searchBarInputElement.val();
    searchBarInputElement.data("given-value", name);
    if (name.length > 0) {
        $.get({
            url: "/model/search",
            dataType: "json",
            data: {
                name: name,
            },
            beforeSend: function() {
                $("#loading").show();
            },
            success: function(data) {
                $(".search-result-box").empty().html(data.result);
                // $(".search-result-product").on("mouseover", function () {
                //     searchBarInputElement.val($(this).data("product-name"));
                // });
                // $(".search-result-product").on("mouseleave", function () {
                //     searchBarInputElement.val(
                //         searchBarInputElement.data("given-value")
                //     );
                // });
            },
            complete: function() {
                $("#loading").hide();
            },
        });
    } else {
        $(".search-result-box").empty();
    }
});

$(".clickable").click(function() {
    window.location = $(this).find("a").attr("href");
    return false;
});

function addWishlist(account_id) {
    Notiflix.Loading.standard('Đang xử lý...');
    $.ajax({
        url: "/model/wishlists",
        method: "POST",
        data: {
            account_id: account_id,
            csrf_token: $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data) {
            Notiflix.Loading.remove();
            if (data.value == 1) {
                Notiflix.Notify.success(data.message);
                $(".countWishlist").html(data.count);
                $(`.countWishlist-${account_id}`).text(data.product_count);
                $(`.wishlist_icon_${account_id}`)
                    .removeClass("fa fa-heart-o")
                    .addClass("fa fa-heart");
                $(".wishlist-tooltip .remove").hide();
                $(".wishlist-tooltip .add").show();
                $(".wishlist-tooltip").show();
                setTimeout(() => $(".wishlist-tooltip").hide(), 2000);
            } else if (data.value == 2) {
                Notiflix.Notify.success(data.message);
                $(".countWishlist").html(data.count);
                $(`.countWishlist-${account_id}`).text(data.product_count);
                $(`.wishlist_icon_${account_id}`)
                    .removeClass("fa fa-heart")
                    .addClass("fa fa-heart-o");
                $(".wishlist-tooltip .remove").show();
                $(".wishlist-tooltip .add").hide();
                $(".wishlist-tooltip").show();
                setTimeout(() => $(".wishlist-tooltip").hide(), 2000);
            } else {
                // Lỗi (chưa đăng nhập hoặc lỗi khác)
                $("#login-alert-modal").modal("show");
            }
        },
        error: function(xhr, status, error) {
            Notiflix.Loading.remove();
            Notiflix.Notify.success(error);
        }
    });
}

$(".function-remove-wishList").on("click", function() {
    let productId = $(this).data("id");
    let modalId = $(this).data("modal");
    removeWishlist(productId, modalId);
});

function removeWishlist(productId, modalId) {
    $.ajax({
        url: $("#route-delete-wishlist").data("url"),
        method: "POST",
        data: {
            id: productId,
            csrf_token: $('meta[name="csrf-token"]').attr('content')
        },
        beforeSend: function() {
            $("#loading").show();
        },
        success: function(data) {
            $(`#${modalId}`).modal("show");
            let countWishlistElement = $(".countWishlist");
            let messageNoDataFound = $("#message-no-data-found").data("text");
            countWishlistElement.html(
                parseInt(countWishlistElement.html()) - 1
            );
            $("#row_id" + productId).hide();
            $(".tooltip").html("");
            if (parseInt(countWishlistElement.html()) % 15 === 0) {
                let wishlistPaginatedPage = $("#wishlist_paginated_page");
                if (wishlistPaginatedPage.val() == 1) {
                    $("#set-wish-list")
                        .empty()
                        .append(
                            `<h6 class="text-muted text-center">` +
                            messageNoDataFound +
                            `</h6>`
                        );
                } else {
                    let pageValue = wishlistPaginatedPage.val();
                    window.location.href =
                        $("#route-wishlists").data("url") +
                        "?page=" +
                        (pageValue - 1);
                }
            }
        },
        complete: function() {
            $("#loading").hide();
        },
    });
}

function renderQuickViewFunction() {
    $(".action-product-quick-view").on("click", function() {
        let productId = $(this).data("product-id");
        productQuickView(productId);
    });
}

$(window).on("load", function() {
    renderQuickViewFunction();
});

function productQuickView(product_id) {
    $.get({
        url: $("#route-quick-view").data("url"),
        dataType: "json",
        data: {
            product_id: product_id,
        },
        beforeSend: function() {
            $("#loading").show();
        },
        success: function(data) {
            $("#quick-view-modal").empty().html(data.view);
            renderOwlCarouselSilder();
            commonFunctionalityForProductView();
            $("#quick-view").modal("show");
        },
        complete: function() {
            $("#loading").hide();
        },
    });
}

$(".action-hide-billing-address").on("click", function() {
    hideBillingAddressFunction();
});

function hideBillingAddressFunction() {
    let checkSameAsShipping = $("#same_as_shipping_address").is(":checked");
    if (checkSameAsShipping) {
        $("#hide_billing_address").hide();
    } else {
        $("#hide_billing_address").show();
    }
}

$(".action-billing-address-hide").on("click", function() {
    billingAddressFunction();
});

function billingAddressFunction() {
    $("#bh-0").prop("checked", true);
    $("#billing_model").collapse();
}


function productQuickViewFunctionalityInitialize() {
    cartQuantityInitialize();

    getVariantPrice(".add-to-cart-details-form");

    $(".add-to-cart-details-form input").on("change", function() {
        getVariantPrice(".add-to-cart-details-form");
    });

    $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
    });

    $(".quick-view-preview-image-by-color").on("click", function() {
        let id = $("#preview-img" + $(this).data("key"));
        $(id).click();
    });
}

$(".product-details-sticky-collapse-btn").on("click", function() {
    $(this).toggleClass("rotate-180");
    $(".product-details-sticky-top").slideToggle("slow");
});

function hideProductDetailsStickySection() {
    $("html, body").animate({
        scrollTop: 0
    }, "slow");
    setTimeout(() => {
        $(".product-details-sticky-section").removeClass("active");
    });
}

function commonFunctionalityForProductView() {
    $(".product-buy-now-button").on("click", function() {
        let parentForm = $(this).data("form");
        let redirectStatus = $(this).data("auth")?.toString();
        let url = $(this).data("route");
        addToCart(
            parentForm ?? ".add-to-cart-details-form",
            redirectStatus,
            url
        );
        if (redirectStatus === "false") {
            setTimeout(function() {
                location.href = url;
            }, 100);
        }
    });

    $(".product-add-to-cart-button").on("click", function() {
        let parentElement = $(this).closest(".product-cart-option-container");
        let productCartForm = parentElement.find(".addToCartDynamicForm");
        addToCart(productCartForm ?? $(".add-to-cart-details-form"));
    });

    $(".product-action-add-wishlist").on("click", function() {
        let id = $(this).data("product-id");
        addWishlist(id);
    });

    $(".product-restock-request-button").on("click", function() {
        let isLoggedIn = $(this).data("auth")?.toString();
        if (isLoggedIn === "true" || isLoggedIn === "1") {
            let parentElement = $(this).closest(
                ".product-cart-option-container"
            );
            let productCartForm = parentElement.find(".addToCartDynamicForm");
            let getFrom = $(this).data("form")?.toString();

            if (productCartForm?.length <= 0 && getFrom && getFrom !== "") {
                productCartForm = $(getFrom);
            }
            getRequestForProductRestock(productCartForm);
        } else {
            $("#login-alert-modal").modal("show");
        }
    });

    function getRequestForProductRestock(formElement) {
        let button = $(".product-restock-request-button");
        $.ajaxSetup({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="_token"]').attr("content"),
            },
        });
        $.ajax({
            url: $("#route-product-restock-request").data("url"),
            type: "POST",
            data: formElement.serializeArray(),
            beforeSend: function() {
                $("#loading").show();
            },
            success: function(response) {
                responseManager(response);
                button.attr("disabled", true);
                button.text(button.data("requested"));

                try {
                    startFCM([response?.fcm_topic]);
                } catch (e) {
                    console.log(e);
                }
            },
            complete: function() {
                $("#loading").hide();
            },
        });
    }
}

commonFunctionalityForProductView();




function cartListQuantityUpdateInit() {
    $(".action-update-cart-quantity").on("click", function() {
        let cartId = $(this).data("cart-id");
        let productId = $(this).data("product-id");
        let action = $(this).data("action");
        let event = $(this).data("event");
        updateCartQuantity(cartId, productId, action, event);
    });

    $(".action-update-cart-quantity-list").on("click", function() {
        let minimumOrderQuantity = $(this).data("minimum-order");
        let key = $(this).data("cart-id");
        let increment = $(this).data("increment");
        let event = $(this).data("event");
        updateCartQuantityList(minimumOrderQuantity, key, increment, event);
    });

    $(".action-change-update-cart-quantity-list").on("change", function() {
        let minimumOrderQuantity = $(this).data("minimum-order");
        let key = $(this).data("cart-id");
        let increment = $(this).data("increment");
        let event = $(this).data("event");
        updateCartQuantityList(minimumOrderQuantity, key, increment, event);
    });

    $(".action-update-cart-quantity-list-mobile").on("click", function() {
        let minimumOrderQuantity = $(this).data("minimum-order");
        let key = $(this).data("cart-id");
        let increment = $(this).data("increment");
        let event = $(this).data("event");
        updateCartQuantityListMobile(
            minimumOrderQuantity,
            key,
            increment,
            event
        );
    });

    $(".action-change-update-cart-quantity-list-mobile").on(
        "change",
        function() {
            let minimumOrderQuantity = $(this).data("minimum-order");
            let key = $(this).data("cart-id");
            let increment = $(this).data("increment");
            let event = $(this).data("event");
            updateCartQuantityListMobile(
                minimumOrderQuantity,
                key,
                increment,
                event
            );
        }
    );

    $(document).ready(function() {
        $(".cart_information").each(function() {
            let allShopItemsInChecked = true;
            $(this)
                .find(".shop-item-check")
                .each(function() {
                    if (!$(this).prop("checked")) {
                        allShopItemsInChecked = false;
                        return false;
                    }
                });
            $(this)
                .find(".shop-head-check")
                .prop("checked", allShopItemsInChecked);
        });
    });

    $(".shop-head-check").on("change", function() {
        $(this)
            .parents(".cart_information")
            .find(".shop-item-check")
            .prop("checked", this.checked);
    });

    $(".shop-item-check").on("change", function() {
        var allChecked = true;
        $(this)
            .parents(".cart_information")
            .find(".shop-item-check")
            .each(function() {
                if (!$(this).prop("checked")) {
                    allChecked = false;
                    return false;
                }
            });
        $(this)
            .parents(".cart_information")
            .find(".shop-head-check")
            .prop("checked", allChecked);
    });

    $(".shop-head-check-desktop").on("change", function() {
        getCartSelectCartItemsCheckedValues(
            '.cart_information input[type="checkbox"].shop-item-check-desktop'
        );
    });

    $(".shop-head-check-mobile").on("change", function() {
        getCartSelectCartItemsCheckedValues(
            '.cart_information input[type="checkbox"].shop-item-check-mobile'
        );
    });

    $(".shop-item-check-desktop").on("change", function() {
        getCartSelectCartItemsCheckedValues(
            '.cart_information input[type="checkbox"].shop-item-check-desktop'
        );
    });

    $(".shop-item-check-mobile").on("change", function() {
        getCartSelectCartItemsCheckedValues(
            '.cart_information input[type="checkbox"].shop-item-check-mobile'
        );
    });

    function getCartSelectCartItemsCheckedValues(elementSelector) {
        let checkedValues = [];
        $(elementSelector).each(function() {
            if ($(this).prop("checked")) {
                checkedValues.push($(this).val());
            }
        });
        getCartSelectCartItemsRequest(checkedValues);
    }


}

cartListQuantityUpdateInit();

function actionCheckoutFunctionInit() {
    $(".action-checkout-function").on("click", function() {
        let getRoute = $("#route-action-checkout-function").data("route");
        if (getRoute && getRoute.toString() === "shop-cart") {
            checkoutFromCartList();
        } else if (getRoute && getRoute.toString() === "checkout-details") {
            checkoutFromShipping();
        } else if (getRoute && getRoute.toString() === "checkout-payment") {
            checkoutFromPayment();
        }
    });

    $(".action-set-shipping-id").on("change", function() {
        let cartGroupId = $(this).data("product-id");
        let id = $(this).val();
        setShippingId(id, cartGroupId);
    });
}

actionCheckoutFunctionInit();


function updateNavCart() {
    $.post(
        $("#route-cart-nav-cart").data("url"), {
            _token: $('meta[name="_token"]').attr("content"),
        },
        function(response) {
            $("#cart_items").html(response.data);
            cartListQuantityUpdateInit();
        }
    );
}

function cartQuantityInitialize() {
    $(".btn-number").click(function(e) {
        e.preventDefault();
        let fieldName = $(this).attr("data-field");
        let type = $(this).attr("data-type");
        let productType = $(this).data("producttype");
        let input = $("input[name='" + fieldName + "']");
        let productContainer = $(this).closest(
            ".product-cart-option-container"
        );
        let currentVal = parseInt(productContainer.find(".input-number").val());
        if (!isNaN(currentVal)) {
            if (type == "minus") {
                if (
                    currentVal >
                    productContainer.find(".input-number").attr("min")
                ) {
                    productContainer
                        .find(".input-number")
                        .val(currentVal - 1)
                        .change();
                }
                if (
                    parseInt(productContainer.find(".input-number").val()) ==
                    productContainer.find(".input-number").attr("min")
                ) {
                    $(this).attr("disabled", true);
                }
            } else if (type == "plus") {
                if (
                    currentVal <
                    productContainer.find(".input-number").attr("max") ||
                    productType === "digital"
                ) {
                    productContainer
                        .find(".input-number")
                        .val(currentVal + 1)
                        .change();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: $("#message-cart").data("text"),
                        text: $("#message-sorry-stock-limit-exceeded").data(
                            "text"
                        ),
                    });
                    productContainer
                        .find(".btn-number")
                        .val(productContainer.find(".btn-number").attr("max"));
                    productContainer.find(".btn-number").attr("disabled", true);
                }

                if (
                    parseInt(input.val()) ==
                    productContainer.find(".input-number").attr("max") &&
                    productType === "physical"
                ) {
                    $(this).attr("disabled", true);
                }
            }
        } else {
            productContainer.find(".input-number").val(0);
        }
    });

    $(".input-number").focusin(function() {
        $(this).data("oldValue", $(this).val());
    });

    $(".input-number").change(function() {
        let productType = $(this).data("producttype");
        let minValue = parseInt($(this).attr("min"));
        let maxValue = parseInt($(this).attr("max"));
        let valueCurrent = parseInt($(this).val());
        let name = $(this).attr("name");
        let productContainer = $(this).closest(
            ".product-cart-option-container"
        );
        if (valueCurrent >= minValue) {
            $(
                ".btn-number[data-type='minus'][data-field='" + name + "']"
            ).removeAttr("disabled");
        } else {
            Swal.fire({
                icon: "error",
                title: $("#message-cart").data("text"),
                text: $("#message-sorry-stock-limit-exceeded").data("text"),
            });
            // $(".input-number").val($(".input-number").attr("max"));
        }
        if (productType === "digital" || valueCurrent <= maxValue) {
            $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr("disabled");
        } else {
            Swal.fire({
                icon: "error",
                title: $("#message-cart").data("text"),
                text: $("#message-sorry-stock-limit-exceeded").data("text"),
            });
            productContainer
                .find(".input-number")
                .val(productContainer.find(".input-number").attr("max"));
        }
    });

    $(".input-number").keydown(function(e) {
        if (
            $.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
            (e.keyCode == 65 && e.ctrlKey === true) ||
            (e.keyCode >= 35 && e.keyCode <= 39)
        ) {
            return;
        }
        if (
            (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
            (e.keyCode < 96 || e.keyCode > 105)
        ) {
            e.preventDefault();
        }
    });
}

function updateQuantity(key, element) {
    $.post(
        $("#route-cart-updateQuantity").data("url"), {
            _token: $('meta[name="_token"]').attr("content"),
            key: key,
            quantity: element.value,
        },
        function(data) {
            updateNavCart();
            $("#cart-summary").empty().html(data);
            couponCode();
        }
    );
}


function getUpdateProductAddUpdateCartBtn(response) {
    try {
        let productInfo = $(".product-generated-variation-code");
        let productVariantExist = false;

        response?.cartList?.map(function(item, index) {
            if (
                productInfo.data("product-id") == item?.id &&
                productInfo.val() == item?.variant
            ) {
                productVariantExist = true;
            }
        });

        if (!productVariantExist) {
            let actionAddToCartBtn = $(".product-add-to-cart-button");
            actionAddToCartBtn.html(actionAddToCartBtn.data("add"));
            $('.product-exist-in-cart-list[name="key"]').val("");
        }
    } catch (e) {}
}

$(".add-to-cart-details-form").on("submit", function(event) {
    event.preventDefault();
});

$(".add-to-cart-details-form input").on("change", () => {
    getVariantPrice(".add-to-cart-details-form");
});

$(".add-to-cart-sticky-form input").on("change", () => {
    getVariantPrice(".add-to-cart-sticky-form");
});

let checkFirstTimeVariant = true;

function getVariantPrice(formSelector = ".add-to-cart-details-form") {
    $(".btn-number").attr("disabled", false);
    if (checkValidityForVariantPrice(formSelector)) {
        $.ajaxSetup({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="_token"]').attr("content"),
            },
        });
        $.ajax({
            type: "POST",
            url: $("#route-cart-variant-price").data("url"),
            data: $(formSelector).serializeArray(),
            success: function(response) {
                updateProductDetailsTopSection(formSelector, response);

                if (
                    formSelector === ".add-to-cart-sticky-form" ||
                    checkFirstTimeVariant
                ) {
                    checkFirstTimeVariant = false;
                    updateProductDetailsBottomSection(formSelector, response);
                }

                if (response?.discount_amount > 0) {
                    if (response?.discount_type === "flat") {
                        $(formSelector)
                            .find(".discounted_badge")
                            .html(`${response?.discount}`);
                    } else {
                        $(formSelector)
                            .find(".discounted_badge")
                            .html(`- ${response?.discount}`);
                    }
                    $(formSelector)
                        .find(".discounted-badge-element")
                        .removeClass("d-none");
                } else {
                    $(formSelector)
                        .find(".discounted-badge-element")
                        .addClass("d-none");
                }
            },
        });
    }
}

$(".product-details-cart-qty").on("keypress keyup", function(event) {
    if (parseInt($(this).val()) > $(this).attr("max")) {
        event.preventDefault();
        $(this).val($(this).attr("min") ?? 1);
        return false;
    }
});

$(".product-quantity-minus").on("click", function() {
    $(this).attr("disabled", true);
});

$(".product-quantity-plus").on("click", function() {
    $(this).attr("disabled", true);
});

function checkValidityForVariantPrice(formSelector) {
    return (
        $(formSelector).find("input[name=quantity]").val() > 0 &&
        checkAddToCartValidity(formSelector)
    );
}

function updateProductDetailsBottomSection(formSelector, response) {
    let productDetailsStickySection = $(".product-details-sticky-section");
    $(".product-bottom-section-price").text(response?.price);

    productDetailsStickySection
        .find(".discounted-unit-price")
        .html(response?.discounted_unit_price);
    productDetailsStickySection
        .find(".product-total-unit-price")
        .html(response?.discount_amount > 0 ? response?.total_unit_price : "");
    productDetailsStickySection
        .find(".product-details-sticky-color-name")
        .html(response?.color_name ? `(${response?.color_name})` : "");

    if (response?.discount_amount > 0) {
        productDetailsStickySection
            .find(".discounted_badge")
            .html(`- ${response?.discount}`);
        productDetailsStickySection
            .find(".discounted-badge-element")
            .removeClass("d-none");
    } else {
        productDetailsStickySection
            .find(".discounted-badge-element")
            .addClass("d-none");
    }

    if (response?.product_type?.toString() === "physical") {
        let productRestockRequestButton = $(formSelector).find(
            ".product-restock-request-button"
        );
        if (response?.quantity <= 0) {
            $(formSelector).find(".product-restock-request-section").show();
            productRestockRequestButton.removeAttr("disabled");
            $(formSelector)
                .find(".product-add-and-buy-section")
                .hide()
                .removeClass("d-flex");
        } else {
            $(formSelector).find(".product-restock-request-section").hide();
            $(formSelector)
                .find(".product-add-and-buy-section")
                .show()
                .addClass("d-flex");
        }
        if (response?.restock_request_status) {
            productRestockRequestButton.html(
                productRestockRequestButton.data("requested")
            );
            productRestockRequestButton.attr("disabled", true);
        } else {
            productRestockRequestButton.html(
                productRestockRequestButton.data("default")
            );
        }
    }
}

function updateProductDetailsTopSection(formSelector, response) {
    $(formSelector)
        .find(".product-details-chosen-price-section")
        .removeClass("d-none");
    $(formSelector)
        .find(".product-details-chosen-price-amount")
        .html(response?.price);
    $(formSelector)
        .find(".product-details-tax-amount")
        .html(response?.update_tax);
    let updatedTax = response?.update_tax.replace(/[^\d.,]/g, "");

    if (updatedTax <= 0) {
        $(".product-details-tax-amount-container").empty();
    }

    $(formSelector)
        .find(".product-details-cart-qty")
        .attr("max", response?.quantity);

    if (response?.product_type?.toString() === "physical") {
        let productRestockRequestButton = $(formSelector).find(
            ".product-restock-request-button"
        );
        if (response?.quantity <= 0) {
            $(formSelector).find(".product-restock-request-section").show();
            productRestockRequestButton.removeAttr("disabled");
            $(formSelector)
                .find(".product-add-and-buy-section")
                .hide()
                .removeClass("d-flex");
        } else {
            $(formSelector).find(".product-restock-request-section").hide();
            $(formSelector)
                .find(".product-add-and-buy-section")
                .show()
                .addClass("d-flex");
        }
        if (response?.restock_request_status) {
            productRestockRequestButton.html(
                productRestockRequestButton.data("requested")
            );
            productRestockRequestButton.attr("disabled", true);
        } else {
            productRestockRequestButton.html(
                productRestockRequestButton.data("default")
            );
        }
    }

    $(formSelector)
        .find(".product-details-cart-qty")
        .val(response?.in_cart_quantity);
    $(formSelector)
        .find(".product-generated-variation-code")
        .val(response?.variation_code);
    $(formSelector)
        .find(".product-generated-variation-text")
        .text(response?.variation_code);

    if (
        $(formSelector).find(".product-details-cart-qty").attr("min") <
        parseFloat($(formSelector).find(".product-details-cart-qty").val())
    ) {
        $(formSelector)
            .find(".btn-number[data-type='minus'][data-field='quantity']")
            .removeAttr("disabled");
    } else {
        $(formSelector)
            .find(".btn-number[data-type='minus'][data-field='quantity']")
            .attr("disabled", true);
    }

    $(formSelector)
        .find(".discounted-unit-price")
        .html(response?.discounted_unit_price);
    $(formSelector)
        .find(".product-total-unit-price")
        .html(response?.discount_amount > 0 ? response?.total_unit_price : "");

    let actionAddToCartBtn = $(formSelector).find(
        ".product-add-to-cart-button"
    );
    if (response?.in_cart_status === 1) {
        $(formSelector)
            .find('.product-exist-in-cart-list[name="key"]')
            .val(response?.in_cart_key);
        actionAddToCartBtn.html(actionAddToCartBtn.data("update"));
    } else {
        $(formSelector)
            .find('.product-exist-in-cart-list[name="key"]')
            .val(response?.in_cart_key);
        actionAddToCartBtn.html(actionAddToCartBtn.data("add"));
    }
}

function checkAddToCartValidity(formSelector = ".add-to-cart-details-form") {
    var names = {};
    $(formSelector)
        .find("input:radio")
        .each(function() {
            names[$(this).attr("name")] = true;
        });
    var count = 0;
    $.each(names, function() {
        count++;
    });

    if ($(formSelector).find("input:radio:checked").length == count) {
        return true;
    }
    return false;
}

function updateFlashDealProgressBar() {
    let getFlashDealsTime = $("#storage-flash-deals").data("value");
    const current_time_stamp = new Date().getTime();
    const start_date = new Date(getFlashDealsTime).getTime();
    const countdownElement = document.querySelector(".cz-countdown");
    try {
        const getEndTime = countdownElement.data("countdown");
        const endTime = new Date(getEndTime).getTime();
        let time_progress =
            ((current_time_stamp - start_date) / (endTime - start_date)) * 100;
        const progress_bar = document.querySelector(".flash-deal-progress-bar");
        progress_bar.style.width = time_progress + "%";
    } catch (e) {}
}

$(".image-preview-before-upload").on("change", function() {
    let getElementId = $(this).data("preview");
    $(getElementId).attr("src", window.URL.createObjectURL(this.files[0]));
    $(getElementId).removeClass("d-none");
    $(getElementId)
        .closest(".custom_upload_input")
        .find(".placeholder-image")
        .css("opacity", "0");
});

$(document).on("ready", function() {
    if ($(".image-preview-before-upload").length) {
        $(".image-preview-before-upload").each(function() {
            if ($(this).data("image")) {
                let getElementId = $(this).data("preview");
                $(getElementId).attr("src", $(this).data("image"));
                $(getElementId).removeClass("d-none");
                $(getElementId)
                    .closest(".custom_upload_input")
                    .find(".placeholder-image")
                    .css("opacity", "0");
            }
        });
    }
});

$("#vendor-remember-input-checked").on("change", function() {
    if ($(this).is(":checked")) {
        $("#apply").removeAttr("disabled");
    } else {
        $("#apply").attr("disabled", "disabled");
    }
});

$("#exampleInputPassword, #exampleRepeatPassword").on("keyup", function() {
    let password = $("#exampleInputPassword").val();
    let passwordRepeat = $("#exampleRepeatPassword").val();
    if (password != "" && passwordRepeat != "") {
        if (password.toString() === passwordRepeat.toString()) {
            $(".pass").hide();
        } else {
            $(".pass").show();
        }
    } else {
        $(".pass").hide();
    }
});

function shareOnSocialMedia() {
    $(".share-on-social-media").on("click", function() {
        let social = $(this).data("social-media-name");
        let url = $(this).data("action");
        let width = 600,
            height = 400,
            left = (screen.width - width) / 2,
            top = (screen.height - height) / 2;
        window.open(
            "https://" + social + encodeURIComponent(url),
            "Popup",
            "toolbar=0,status=0,width=" +
            width +
            ",height=" +
            height +
            ",left=" +
            left +
            ",top=" +
            top
        );
    });
}

shareOnSocialMedia();

var directionFromSession = $("#direction-from-session").data("value");
directionFromSession = directionFromSession ? directionFromSession : "ltr";

const themeDirection = $("html").attr("dir");

function renderOwlCarouselSilder() {
    var sync1 = $("#sync1");
    var sync2 = $("#sync2");
    var thumbnailItemClass = ".owl-item";
    var slides = sync1
        .owlCarousel({
            startPosition: 12,
            items: 1,
            loop: false,
            margin: 0,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: false,
            scrollPerPage: true,
            autoplayHoverPause: false,
            nav: false,
            dots: false,
            rtl: themeDirection && themeDirection.toString() === "rtl",
        })
        .on("changed.owl.carousel", syncPosition);

    function syncPosition(el) {
        var owl_slider = $(this).data("owl.carousel");
        var loop = owl_slider.options.loop;

        if (loop) {
            var count = el.item.count - 1;
            var current = Math.round(el.item.index - el.item.count / 2 - 0.5);
            if (current < 0) {
                current = count;
            }
            if (current > count) {
                current = 0;
            }
        } else {
            var current = el.item.index;
        }

        var owl_thumbnail = sync2.data("owl.carousel");
        var itemClass = "." + owl_thumbnail.options.itemClass;

        var thumbnailCurrentItem = sync2
            .find(itemClass)
            .removeClass("synced")
            .eq(current);
        thumbnailCurrentItem.addClass("synced");

        if (!thumbnailCurrentItem.hasClass("active")) {
            var duration = 500;
            sync2.trigger("to.owl.carousel", [current, duration, true]);
        }
    }

    var thumbs = sync2
        .owlCarousel({
            startPosition: 12,
            items: 4,
            loop: false,
            margin: 10,
            autoplay: false,
            nav: false,
            dots: false,
            rtl: themeDirection && themeDirection.toString() === "rtl",
            responsive: {
                576: {
                    items: 4,
                },
                768: {
                    items: 4,
                },
                992: {
                    items: 4,
                },
                1200: {
                    items: 5,
                },
                1400: {
                    items: 5,
                },
            },
            onInitialized: function(e) {
                var thumbnailCurrentItem = $(e.target)
                    .find(thumbnailItemClass)
                    .eq(this._current);
                thumbnailCurrentItem.addClass("synced");
            },
        })
        .on("click", thumbnailItemClass, function(e) {
            e.preventDefault();
            var duration = 500;
            var itemIndex = $(e.target).parents(thumbnailItemClass).index();
            sync1.trigger("to.owl.carousel", [itemIndex, duration, true]);
        })
        .on("changed.owl.carousel", function(el) {
            var number = el.item.index;
            var owl_slider = sync1.data("owl.carousel");
            owl_slider.to(number, 500, true);
        });
    sync1.owlCarousel();
}

renderOwlCarouselSilder();

function findCountryObject(data) {
    return data.find((obj) => obj.types && obj.types.includes("country"));
}

$(".close-element-onclick-by-data").on("click", function() {
    $($(this).data("selector")).slideUp("slow").fadeOut("slow");
});
$(".password-check").on("keyup keypress change click", function() {
    let password = $(this).val();
    let passwordError = $(".password-error");
    let passwordErrorMessage = $("#password-error-message");
    switch (true) {
        case password.length < 8:
            passwordError
                .html(passwordErrorMessage.data("max-character"))
                .removeClass("d-none");
            break;
        case !/[a-z]/.test(password):
            passwordError
                .html(passwordErrorMessage.data("lowercase-character"))
                .removeClass("d-none");
            break;
        case !/[A-Z]/.test(password):
            passwordError
                .html(passwordErrorMessage.data("uppercase-character"))
                .removeClass("d-none");
            break;
        case !/\d/.test(password):
            passwordError
                .html(passwordErrorMessage.data("number"))
                .removeClass("d-none");
            break;
        case !/[@.#$!%*?&]/.test(password):
            passwordError
                .html(passwordErrorMessage.data("symbol"))
                .removeClass("d-none");
            break;
        default:
            passwordError.addClass("d-none").empty();
    }
});

function setEqualHeight(slides) {
    let maxHeight = 0;

    slides.forEach((slide) => {
        slide.style.height = "";
        if (slide.offsetHeight > maxHeight) {
            maxHeight = slide.offsetHeight;
        }
    });

    slides.forEach((slide) => {
        slide.style.height = maxHeight + "px";
    });
}

$(".footer-slider").owlCarousel({
    margin: 10,
    items: 3,
    // responsiveClass: true,
    nav: false,
    dots: false,
    loop: false,
    autoplay: false,
    rtl: themeDirection && themeDirection.toString() === "rtl",
    autoHeight: true,
    responsive: {
        768: {
            items: $(".footer-slider")?.data('item') ?? 4,
            margin: 40,
        },
    },
});

$(".footer-top-slider").owlCarousel({
    margin: 20,
    items: 2,
    nav: false,
    dots: false,
    loop: false,
    autoplay: false,
    responsiveClass: true,
    rtl: themeDirection && themeDirection.toString() === "rtl",
    autoHeight: true,
    responsive: {
        500: {
            items: 3,
        },
        768: {
            items: 4,
        },
    },
});

function sameHeight() {
    setEqualHeight(
        document.querySelectorAll(
            ".footer-slider-container .footer-slider .owl-item"
        )
    );
    setEqualHeight(document.querySelectorAll(".footer-top-slider .owl-item"));
}

sameHeight();

$(window).on("resize", sameHeight);

$(".promotional-banner-slider").owlCarousel({
    margin: 20,
    items: 1,
    nav: true,
    dots: false,
    loop: true,
    rtl: themeDirection && themeDirection.toString() === "rtl",
    responsive: {
        768: {
            items: 2,
            nav: true,
            dots: false,
            loop: true,
        },
    },
});

function playAudio() {
    document.getElementById("myAudio").play();
}

$(window).on("load", function() {
    $(".upload-file__input").on("change", function() {
        if (this.files && this.files[0]) {
            let reader = new FileReader();
            let img = $(this)
                .siblings(".upload-file__img")
                .find("img")
                .removeAttr("hidden");
            $(this)
                .siblings(".upload-file__img")
                .find(".temp-img-box")
                .remove();

            reader.onload = function(e) {
                img.attr("src", e.target.result);
            };

            reader.readAsDataURL(this.files[0]);
        }
    });
});

function downloadFileUsingFileUrl(url) {
    fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
            const filename = url.substring(url.lastIndexOf("/") + 1);
            const blobUrl = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = blobUrl;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        })
        .catch((error) => console.error("Error downloading file:", error));
}

$(".getDownloadFileUsingFileUrl").on("click", function() {
    let getLink = $(this).data("file-path");
    downloadFileUsingFileUrl(getLink);
});
$(".sidebar-overlay").on("click", function() {
    $(".cz-sidebar").removeClass("show active");
});

$(".get-session-recaptcha-auto-fill").each(function() {
    getSessionRecaptchaCode($(this).data("session"), $(this).data("input"));
});

$(".get-session-recaptcha-auto-fill").on("click", function() {
    getSessionRecaptchaCode($(this).data("session"), $(this).data("input"));
});

$(".otp-login-btn").on("click", function() {
    $(this).addClass("d-none");
    $(".manual-login-btn").removeClass("d-none");
    $(".manual-login-items").addClass("d-none");
    $(".otp-login-items").removeClass("d-none");
    $(".phone-input-with-country-picker").attr("required", true);
    $(".auth-email-input").attr("required", false);
    $(".auth-password-input").attr("required", false);
    $(".auth-login-type-input").val("otp-login");
});

$(".manual-login-btn").on("click", function() {
    $(this).addClass("d-none");
    $(".otp-login-btn").removeClass("d-none");
    $(".otp-login-items").addClass("d-none");
    $(".manual-login-items").removeClass("d-none");
    $(".phone-input-with-country-picker").attr("required", false);
    $(".auth-email-input").attr("required", true);
    $(".auth-password-input").attr("required", true);
    $(".auth-login-type-input").val("manual-login");
});


$(".clean-phone-input-value").on("input", function() {
    $(this).val($(this).val().replace(/\s/g, ""));
});

function productRestockStockLimitStatus(response) {
    let mainElement = $(".product-restock-stock-alert");
    mainElement.find(".title").html(response?.title);
    mainElement.find(".image").attr("width", 50).attr("src", response?.image);
    mainElement.find(".message").html(response?.body);
    mainElement.find(".product-link").removeAttr("data-link");
    mainElement.find(".product-link").attr("data-link", response?.route);
    mainElement.addClass("active");
    setTimeout(() => {
        mainElement.removeClass("active");
    }, 100000);
}

$(".product-restock-stock-close").on("click", function() {
    $(".product-restock-stock-alert").removeClass("active");
});

$('.only-integer-input-field').on("keypress keyup change", function(event) {
    let inputValue = $(this).val();
    if (event.type === "keypress" && (event.which < 48 || event.which > 57) && event.which !== 46) {
        event.preventDefault();
    }
    if ((inputValue.match(/\./g) || []).length > 1) {
        $(this).val(inputValue.slice(0, inputValue.lastIndexOf('.')));
    }
    $(this).val(inputValue.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
});

$('.form-loading-button-form').on('submit', function() {
    $(this).find('[type="submit"]').addClass('active-loading').attr('disabled', true);
    $(this).find('.form-cancel-button').attr('disabled', true);
});