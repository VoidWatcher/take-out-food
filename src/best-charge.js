const loadAllItems = require('./items.js');
const loadPromotions = require('./promotions.js');

function bestCharge (selectedItems) {
    let items = loadAllItems();
    
    let selectedItemsIfo = new Array();
    for (let i = 0; i < selectedItems.length; i++) {
      selectedItemsIfo.push({
        id: selectedItems[i].split("x")[0].trim(), 
        count:parseInt(selectedItems[i].split("x")[1])
      });
    }
    
    let itemsCount = new Array();
    for(let i = 0; i < items.length; i++) {
      for(let j = 0; j < selectedItemsIfo.length; j++) {
        if(items[i].id === selectedItemsIfo[j].id)
          itemsCount.push({
            id:items[i].id,
            name:items[i].name,
            price:items[i].price,
            count:selectedItemsIfo[j].count
          })
      }
    }
    
    let promotionIfo = loadPromotions();
  
    let discount_1 = 0;
    let cost = 0;
    for (let i = 0;i < itemsCount.length; i++) {
      cost += itemsCount[i].price * itemsCount[i].count;
    }
    if (parseInt(cost/30) > 0) 
      discount_1 = 6;
    else 
      discount_1 = 0;
    
    let discount_2 = 0;
    let discountName = new Array();
    for (let i = 0; i < itemsCount.length; i++) {
      for (let j = 0; j < promotionIfo[1].items.length; j++) {
        if (itemsCount[i].id === promotionIfo[1].items[j] && j < (promotionIfo[1].items.length - 1)) {
          discount_2 += itemsCount[i].price * itemsCount[i].count / 2;
          discountName = discountName + itemsCount[i].name + '，';
        }
        if (itemsCount[i].id === promotionIfo[1].items[j] && j === (promotionIfo[1].items.length - 1)) {
          discount_2 += itemsCount[i].price * itemsCount[i].count / 2;
          discountName = discountName + itemsCount[i].name;
        }
      }
    }
    
    let sum = new Array();
    let totalprice = 0;
    itemsCount.map(value => totalprice += value.price * value.count)
    if (discount_1 < discount_2)
      sum.push({
        discount: discount_2, 
        totalprice: totalprice - discount_2,
        type: promotionIfo[1].type + '(' + discountName + ')'
      })
    else 
      sum.push({
        discount: discount_1,
        totalprice: totalprice - discount_1, 
        type: promotionIfo[0].type
      });
  

    let printIfo = new Array();
    let print = [];
    printIfo.push(`============= 订餐明细 =============`);
    for (let i = 0; i < itemsCount.length; i++) {
      printIfo.push(`${itemsCount[i].name} x ${itemsCount[i].count} = ${itemsCount[i].count * itemsCount[i].price}元` );
    }
    printIfo.push(`-----------------------------------`);
    if (discount_1 !== 0 && discount_2 !== 0) {
      printIfo.push('使用优惠:');
      printIfo.push(`${sum[0].type}，省${sum[0].discount}元`);
      printIfo.push(`-----------------------------------`);
    }
    printIfo.push(`总计：${sum[0].totalprice}元`);
    printIfo.push(`===================================`);
  
    for(let i = 0; i < printIfo.length; i++){
      print = print + printIfo[i].toString() + '\n';
    }
    return print.trim();
}


module.exports = bestCharge;