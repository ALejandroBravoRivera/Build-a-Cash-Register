// Global variables (se pueden reasignar en pruebas)
let price = 19.5;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

// DOM references
const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const priceDisplay = document.getElementById("price-display");

priceDisplay.textContent = price.toFixed(2);

// Currency values
const currencyUnit = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.1,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100
};

function checkCashRegister(price, cash, cid) {
  let change = cash - price;
  let totalCID = parseFloat(
    cid.reduce((sum, curr) => sum + curr[1], 0).toFixed(2)
  );

  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (cash === price) {
    changeDue.textContent =
      "No change due - customer paid with exact cash";
    return;
  }

  if (totalCID < change) {
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  if (totalCID === change) {
    changeDue.textContent =
      "Status: CLOSED " +
      cid
        .filter((den) => den[1] > 0)
        .map((den) => `${den[0]}: $${den[1]}`)
        .join(" ");
    return;
  }

  // Prepare to give change
  let changeArr = [];
  let remaining = change;

  let reversedCID = [...cid].reverse();

  for (let [unit, amount] of reversedCID) {
    let unitValue = currencyUnit[unit];
    let toReturn = 0;

    while (remaining >= unitValue && amount > 0) {
      remaining = parseFloat((remaining - unitValue).toFixed(2));
      amount = parseFloat((amount - unitValue).toFixed(2));
      toReturn = parseFloat((toReturn + unitValue).toFixed(2));
    }

    if (toReturn > 0) {
      changeArr.push([unit, toReturn]);
    }
  }

  if (remaining > 0) {
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  changeDue.textContent =
    "Status: OPEN " +
    changeArr.map((den) => `${den[0]}: $${den[1]}`).join(" ");
}

// Event listener
purchaseBtn.addEventListener("click", () => {
  const cash = parseFloat(cashInput.value);

  if (isNaN(cash)) {
    alert("Please enter a valid amount of cash");
    return;
  }

  checkCashRegister(price, cash, cid);
});