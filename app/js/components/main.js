/* 
 *   Created on : Jan 28, 2016, 12:24:53 PM
 *   Author     : Nguyen Viet Bach
 */

var animationTime = window.innerWidth >= 768 ? 100 : 0;

Number.prototype.formatMoney = formatMoney;

String.prototype.endsWith = endsWith;

Array.prototype.binaryIndexOf = binaryIndexOf;  

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
    jPriceInput.keypress(function (e) {
        checkPriceInput(e, kc);
    })
            .blur(function () {
                var p = $(this).val();
                if (!/^\-?\d+$/g.test(p) || p === "-") {
                    $(this).val("");
                    return false;
                }
                var sign = "";
                if (p.charAt(0) === "-") {
                    p = p.slice(1);
                    sign = "-";
                }
                var correctValue = correctPrice(p);
                if (!correctValue) {
                    jPriceInput.val("");
                    return false;
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
                return false;
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
                .keyup(function (e) {
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
    for (var i = 0; i < 1; i++) {
        catalog.items.push(new Item(
                Math.floor((Math.random() * 10) + 1) + i,
                "40152233",
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
    $("#search").keyup(function (e) {
        var t = $(this);
        if (e.keyCode === 13) {
            var filter = t.val();
            var i = catalog.items.binaryIndexOf(filter);
            if (i >= 0) {
                var item = catalog.items[i];
                addItemToCheckout(
                    item.itemId, 
                    item.name, 
                    item.price, 
                    item.group, 
                    item.tax, 
                    item.tags, 
                    item.desc
                );
                t.removeClass("not-found");
            } else {
                t.addClass("not-found");
            }
            t.val("");
 
        }
    }).click(function(){
        $(this).removeClass("not-found");
    }).focus(function(){
        $(this).removeClass("not-found");
    });

                /*
                dropDown.html(createFoundItem(item.name, item.price));
                dropDown.addClass("visible");
            } else {
                dropDown.html("");
            }*/
    /*$("#live-search").blur(function () {
        dropDown.html("");
        dropDown.removeClass("visible");
    });*/
});
