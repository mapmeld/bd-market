(function() {
  if (document.getElementById("unit")) {
    var unitCost = document.getElementById("unit").value;
    var remainder = document.getElementById("remainder").value;
    var quantity = document.getElementById("quantity");
    var totalCost = document.getElementById("total");

    quantity.oninput = function(e) {
      var q = quantity.value * 1;
      if (q <= 0 || isNaN(q) || (Math.round(q) !== q)) {
        quantity.value = 1;
        totalCost.value = '৳' + unitCost;
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      if (q > remainder) {
        q = remainder;
        quantity.value = remainder;
      }
      var total = q * unitCost;
      totalCost.value = '৳' + total.toFixed(2);
    };
  }
})();