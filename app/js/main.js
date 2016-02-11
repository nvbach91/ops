/* 
 *   Created on : Jan 28, 2016, 12:24:53 PM
 *   Author     : Nguyen Viet Bach
 */

var windowWidth = window.innerWidth;
var animationTime = windowWidth >= 768 ? 100 : 0;

/**
 * Performs a binary search on the host array. This method can either be
 * injected into Array.prototype or called with a specified scope like this:
 * binaryIndexOf.call(someArray, searchElement);
 *
 * @param {*} searchElement The item to search for within the array.
 * @return {Number} The index of the element which defaults to -1 when not found.
 */
function binaryIndexOf(searchElement) {
    'use strict';

    var minIndex = 0;
    var maxIndex = this.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = this[currentIndex];

        if (currentElement < searchElement) {
            minIndex = currentIndex + 1;
        }
        else if (currentElement > searchElement) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }

    return -1;
}

Array.prototype.binaryIndexOf = binaryIndexOf;

var Item = function (id, ean, name, price, desc) {
    this.id = id;
    this.ean = ean;
    this.name = name;
    this.price = price;
    this.desc = desc;
};

Item.prototype.valueOf = function () {
    return this.ean;
};

var createFoundItem = function (name, price) {
    return '<li class="dd-item">' +
            '<div class="dd-name">' + name + '</div>' +
            '<div class="dd-price">' + price + '</div>' +
            '</li>';
};

var isFloat = function (n) {
    return n === Number(n) && n % 1 !== 0;
}
;
var beep = function () {
    var b = document.getElementById("beep");
    b.pause();
    b.currentTime = 0;
    b.play();
};
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d === undefined ? "." : d,
            t = t === undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}
;

var correctPrice = function (pr) {
    var p = pr.replace(/\./g, "");
    var correctValue = "";
    while (p.length > 2 && p.charAt(0) === "0") {
        p = p.slice(1);
    }
    if (parseInt(p) === 0) {
        return false;
    }
    if (p.length > 2) {
        correctValue = p.slice(0, p.length - 2) + "." + p.slice(p.length - 2, p.length);
    } else if (p.length > 1) {
        correctValue = "0." + p;
    } else if (p.length > 0) {
        correctValue = "0.0" + p;
    }
    return correctValue;
}
;

var recalculateTotalCost = function () {
    var saleList = $("#sale-list");
    if (saleList.children().size() === 1) {
        $("#si-placeholder").removeClass("hidden");
    }
    var totalCost = 0;
    var itemsCnt = 0;
    saleList.find(".sale-item").each(function () {
        var si = $(this);
        var q = parseInt(si.find(".si-quantity").val());
        itemsCnt += q;
        var p = parseFloat(si.find(".si-price").text());
        var subTotal = p * q;
        var discountPercent = si.find(".d-discount").val() / 100;
        subTotal = subTotal - subTotal * discountPercent;
        subTotal.toFixed(2);
        si.find(".si-total").text(subTotal.formatMoney(2, ".", ""));
    });
    saleList.find(".sale-item .si-total").each(function () {
        totalCost += parseFloat($(this).text());
    });
    totalCost.toFixed(2);
    var totalCostText = totalCost.formatMoney(2, ",", " ");
    $("#checkout-total").text("Total: " + totalCostText + " Kč");
    $("#pay-amount").text(totalCostText + " Kč");
    $("#checkout-label").text("CHECKOUT (" + itemsCnt + " item" + (itemsCnt !== 1 ? "s" : "") + ")");
}
;

var checkPriceInput = function (e, u) {
    u.text("keyCode: " + e.keyCode);
    var p = $("#price-input");
    if (e.keyCode === 13) { // allow enter 
        if (p.val().length) {
            p.blur();
        }
        return true;
    }
    if (e.keyCode === 8) { //allow backspace)
        return true;
    }
    if (e.keyCode === 109 || e.keyCode === 189 || e.keyCode === 173) { // check for multiple dashes
        if (p.val().length)
            return false;
        return p.val().indexOf("-") < 0;
    }
    // prevent non-digit key press
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
};

var checkNumericInput = function (e, t) {
    if (e.keyCode === 13) { // allow enter and blur upon press
        //var s = e.data;
        t.blur();
        return true;
    }
    if (e.keyCode === 8) { //allow backspace
        return true;
    }

    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
};

var showInCurtain = function (s) {
    var curtain = $("<div></div>").attr("id", "curtain").click(function () {
        $(this).fadeOut(animationTime, function () {
            $(this).remove();
        });
    });
    curtain.append(s).hide();
    $("#app").append(curtain);
    curtain.fadeIn(animationTime);
}
;
var addItemToCheckout = function (itemId, name, price, group, tax, tags, desc) {
    var jSaleList = $("#sale-list");
    var jSaleListPlaceHolder = jSaleList.find("#si-placeholder");
    if (jSaleListPlaceHolder.size()) {
        jSaleListPlaceHolder.addClass("hidden");
    }
    if (jSaleList.children().size() > 0) {
        jSaleList.children().eq(jSaleList.children().size() - 1).removeClass("last");
    }
    // creating sale item and bind events
    var item = $("<li>").addClass("sale-item last");
    var main = $("<div></div>").addClass("sale-item-main");
    $("<div></div>").addClass("si-id").text(itemId).appendTo(main);
    $("<div></div>").addClass("si-name").text(name).appendTo(main);
    $("<input />")
            .addClass("si-quantity")
            .attr({maxlength: 3})
            .val(1)
            .keydown(function (e) {
                checkNumericInput(e, this);
            })
            .focus(function () {
                $(this).select();
            })
            .blur(function () {
                if (!$(this).val()) {
                    ($(this).val(0));
                }
                recalculateTotalCost();
            })
            .appendTo(main);
    $("<div></div>").addClass("si-price").text(price).appendTo(main);
    $("<div></div>").addClass("si-total").text(price).appendTo(main);
    $("<button></button")
            .addClass("si-remove")
            .click(function () {
                $(this).parent().parent().slideUp(animationTime, function () {
                    $(this).remove();
                    recalculateTotalCost();
                });
            })
            .appendTo(main);
    main.children(".si-name, .si-price, .si-total").click(function () {
        $(this).parent().parent().find(".sale-item-extend")
                .slideToggle(animationTime, function () {
                    var t = $(this);
                    if (t.is(":hidden")) {
                        t.parent().removeClass("expanded");
                    } else {
                        t.parent().addClass("expanded");
                    }
                });
    });
    main.appendTo(item);
    var details = $("<div></div>").addClass("sale-item-extend");

    var individualPrice = $("<div></div>").addClass("change-price");
    $("<div></div>").addClass("d-label").text("Individual Price").appendTo(individualPrice);
    $("<input />")
            .addClass("d-price")
            .attr({maxlength: 7, placeholder: "e.g. 4200 = 42.00"})
            .val(price)
            .keydown(function (e) {
                checkNumericInput(e, this);
            })
            .blur(function () {
                var t = $(this);
                var p = t.val();
                var correctValue = correctPrice(p);
                if (!correctValue || !/^\-?\d+\.\d{2}$/g.test(correctValue)) {
                    t.addClass("invalid");
                } else {
                    t.removeClass("invalid");
                    t.val(correctValue);
                    t.parents().eq(2).find(".si-price").text(correctValue);
                    /**************ATTENTION****************/
                    if (jSaleList.find(".d-discount").val() <= 100) {
                        recalculateTotalCost();
                    }
                }
            })
            .focus(function () {
                $(this).select();
            })
            .appendTo(individualPrice);

    var individualDiscount = $("<div></div>").addClass("change-discount");
    $("<div></div>").addClass("d-label").text("Individual Discount (%)").appendTo(individualDiscount);
    $("<input />").addClass("d-discount")
            .attr({maxlength: 3, placeholder: "0 - 100"})
            .val(0)
            .keydown(function (e) {
                checkNumericInput(e, this);
            })
            .blur(function () {
                var t = $(this);
                if (/^\d{1,2}$|^100$/g.test(t.val())) {
                    t.removeClass("invalid");
                    recalculateTotalCost();
                } else {
                    t.addClass("invalid");
                }
            })
            .focus(function () {
                $(this).select();
            })
            .appendTo(individualDiscount);

    var openDetailsLightbox = $("<div></div>").addClass("open-detail");
    $("<div></div>").addClass("d-label").text("Details").appendTo(openDetailsLightbox);

    // bind details button in sale list, generate details box
    $("<button></button>").addClass("d-detail")
            .click(function () {
                var detailsBox = $("<div></div>").attr("id", "details-box").click(function (e) {
                    e.stopPropagation();
                });
                $("<div></div>").addClass("db-header")
                        .append($("<div></div>").addClass("db-title").text("Product Details"))
                        .append($("<button></button>").addClass("db-close").click(function () {
                            $(this).parents().eq(2).remove();
                        })).appendTo(detailsBox);
                var lbBody = $("<div></div>").addClass("db-body");
                var lbInfo = $("<div></div>").addClass("db-info");
                $("<div></div>").addClass("db-name").text("Name: " + name).appendTo(lbInfo);
                $("<div></div>").addClass("db-price").text("Price: " + price + " Kč").appendTo(lbInfo);
                $("<div></div>").addClass("db-group").text("Group: " + group).appendTo(lbInfo);
                $("<div></div>").addClass("db-tax").text("Tax: " + tax).appendTo(lbInfo);
                $("<div></div>").addClass("db-tags").text("Tags: " + tags).appendTo(lbInfo);
                $("<div></div>").addClass("db-desc").text("Description: " + desc).appendTo(lbInfo);
                lbInfo.appendTo(lbBody);
                $("<div></div>").addClass("db-img").appendTo(lbBody);

                lbBody.appendTo(detailsBox);

                showInCurtain(detailsBox);
            })
            .appendTo(openDetailsLightbox);

    individualPrice.appendTo(details);
    individualDiscount.appendTo(details);
    openDetailsLightbox.appendTo(details);

    details.hide();
    details.appendTo(item);
    item.appendTo(jSaleList);

    jSaleList.animate({
        scrollTop: jSaleList[0].scrollHeight
    }, animationTime);

    recalculateTotalCost();
    beep();
}
;

$(document).ready(function () {
    var kc = $("#kc");
    // reset checkout
    var jSaleList = $("#sale-list");
    $("#discard-sale").click(function () {
        jSaleList.find(".sale-item").slideUp(animationTime, function () {
            $(this).remove();
            recalculateTotalCost();
        });
    });

    // Price input accepts only numeric values, also only reacts to enter and backspace
    var jPriceInput = $("#price-input");
    var jRegistrySession = $("#registry-session");
    jPriceInput.keydown(function (e) {
        checkPriceInput(e, kc);
    })
            .blur(function () {
                var p = $(this).val();
                if (!/^\-?\d+$/g.test(p) || p === "-") {
                    $(this).val("");
                    return;
                }
                var sign = "";
                if (p.charAt(0) === "-") {
                    p = p.slice(1);
                    sign = "-";
                }
                var correctValue = correctPrice(p);
                if (!correctValue) {
                    jPriceInput.val("");
                    return;
                }
                jPriceInput.val(sign + correctValue);
            })
            .click(function () {
                jPriceInput.val("");
                jRegistrySession.text("0");
            })
            .focus(function () {
                jPriceInput.val("");
                jRegistrySession.text("0");
            });

    // Clicking on sale-group buttons adds an item to the sale list
    $("#sale-groups button").click(function () {
        var t = $(this);
        var lastItem = jSaleList.find(".sale-item.last");
        // do not register an item of different group while price input is the same
        // user must type the same price for another sale group
        // reset the price input and play error sound
        if (lastItem.find(".si-name").text().length) {
            if (t.text() !== lastItem.find(".si-name").text()
                    && jRegistrySession.text() === "1") {
                //beep();
                jPriceInput.val("");
                return;
            }
        }
        var price = jPriceInput.val();
        var priceFloat = parseFloat(price);
        if (priceFloat !== 0 && !isNaN(priceFloat)) {
            if (t.text() === lastItem.find(".si-name").text()
                    && price === lastItem.find(".si-price").text()
                    && jRegistrySession.text() === "1") {
                var lastQuantity = lastItem.find(".si-quantity");
                lastQuantity.val(parseInt(lastQuantity.val()) + 1);
                recalculateTotalCost();
                beep();
            } else {
                var itemId = t.text();
                var name = t.text();
                var group = t.text();
                var tax = t.text();
                var tags = t.text();
                var desc = t.text();
                addItemToCheckout(itemId, name, price, group, tax, tags, desc);
            }
        } /*else {
         console.log("invalid price input");
         }*/
        jRegistrySession.text("1");
    });

    // bind quick sell buttons
    $("#quick-sales .qs-item button").click(function () {
        var t = $(this);
        var lastItem = jSaleList.find(".sale-item.last");

        var price = t.parent().find(".qs-price").text();
        jPriceInput.val(price);

        if (t.parent().find(".qs-id").text() === lastItem.find(".si-id").text()) {
            var lastQuantity = lastItem.find(".si-quantity");
            lastQuantity.val(parseInt(lastQuantity.val()) + 1);
            recalculateTotalCost();
            beep();
        } else {
            var name = t.text();
            var itemId = t.parent().find(".qs-id").text();
            var tax = t.parent().find(".qs-tax").text();
            var group = t.parent().find(".qs-group").text();
            var tags = t.parent().find(".qs-tags").text();
            var desc = t.parent().find(".qs-desc").text();
            addItemToCheckout(itemId, name, price, group, tax, tags, desc);
        }
    });

    // bind control panel buttons
    $("#logo > div").click(function () {
        $("#menu-left").addClass("visible");
    });
    $("#menu-header > div, #main").click(function () {
        $("#menu-left").removeClass("visible");
    });

    // bind pay button to proceed to payment, generate payment box
    $("#pay").click(function () {
        var paymentBox = $("<div></div>").attr("id", "payment-box")
                .click(function (e) {
                    e.stopPropagation();
                });
        $("<div></div>").addClass("pb-header")
                .append($("<div></div>").addClass("pb-title").text("Payment"))
                .append($("<button></button>").addClass("pb-close").click(function () {
                    $(this).parents().eq(2).remove();
                })).appendTo(paymentBox);
        var paymentBody = $("<div></div>").addClass("pb-body");
        var receipt = $("<div></div>").addClass("receipt");
        $("<div></div>").addClass("receipt-header").text("Receipt Preview").appendTo(receipt);
        var receiptBody = $("<ul></ul>").addClass("receipt-body");
        jSaleList.find(".sale-item").each(function () {
            var t = $(this);
            var q = t.find(".si-quantity").val();
            var n = t.find(".si-name").text();
            var thisTotal = t.find(".si-total").text();
            var receiptItem = $("<li></li>").addClass("receipt-item")
                    .append($("<div></div>").addClass("ri-n").text(n))
                    .append($("<div></div>").addClass("ri-x"))
                    .append($("<div></div>").addClass("ri-q").text(q))
                    .append($("<div></div>").addClass("ri-tt").text(thisTotal));
            receiptBody.append(receiptItem);
        });
        var total = $("#pay-amount").text().replace(/,/g, ".").replace(/[^\d\.]/g, "");
        receiptBody.appendTo(receipt);
        $("<div></div>").addClass("receipt-footer").text("EnterpriseApps").appendTo(receipt);

        var payment = $("<div></div>").addClass("payment");
        $("<div></div>").addClass("cash-pay-label").text("Amount tendered").appendTo(payment);
        var cashInputContainer = $("<div></div>").attr("id", "cash-input-container");
        $("<input/>").attr("id", "cash-input")
                .attr("placeholder", "0.00")
                .attr("maxlength", "6")
                .val(total)
                .keydown(function (e) {
                    checkNumericInput(e, this);
                })
                .blur(function () {
                    var t = $(this);
                    var p = t.val();
                    var correctValue = correctPrice(p);
                    if (!correctValue || !/^\-?\d+\.\d{2}$/g.test(correctValue)) {
                        t.addClass("invalid");
                    } else {
                        t.removeClass("invalid");
                        t.val(correctValue);
                    }
                })
                .focus(function () {
                    $(this).select();
                }).appendTo(cashInputContainer);
        $("<button></button>").addClass("cash-confirm").text("OK").appendTo(cashInputContainer);
        cashInputContainer.appendTo(payment);
        var quickCashLabel = $("<div></div>").addClass("cash-quick-label").text("Quick cash payment");
        quickCashLabel.appendTo(payment);
        var quickCash = $("<div></div>").addClass("cash-quick");
        var qcs = [100, 200, 500, 1000, 2000, 5000];
        for (var i = 0; i < qcs.length; i++) {
            $("<button></button>").addClass("cash-button").text(qcs[i])
                    .click(function () {
                        var cash = $(this).text();
                        $("#cash-input").val(cash + "00").blur();
                    })
                    .appendTo(quickCash);
        }
        quickCash.appendTo(payment);
        $("<div></div>").addClass("cash-change").text(0).appendTo(payment);

        payment.appendTo(paymentBody);
        $("<div></div>").addClass("receipt-container").append(receipt).appendTo(paymentBody);

        paymentBody.appendTo(paymentBox);

        showInCurtain(paymentBox);
    });

    var catalog = {items: []};
    for (var i = 0; i < 10; i++) {
        catalog.items.push(new Item(
                Math.floor((Math.random() * 10) + 1) + i,
                "4" + i,
                "Water " + i,
                (15 + i) + ".00",
                "description"
                ));
    }
    catalog.items.sort(function (a, b) {
        return a.ean < b.ean ? -1 : 1;
    });
    //g = catalog.items;
    var dropDown = $("#dropdown");
    $("#search").keyup(function () {
        var filter = $(this).val();
        var i = catalog.items.binaryIndexOf(filter);
        if (i >= 0) {
            var item = catalog.items[i];
            dropDown.html(createFoundItem(item.name, item.price));
            dropDown.addClass("visible");
        } else {
            dropDown.html("");
        }
    });
    $("#live-search").blur(function () {
        dropDown.html("");
        dropDown.removeClass("visible");
    });
});
