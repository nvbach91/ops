/* 
 *   Created on : Jan 28, 2016, 12:24:53 PM
 *   Author     : Nguyen Viet Bach
 */
 
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