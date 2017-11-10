var mysql = require("mysql")
var inquirer = require('inquirer');
var orderId;
var orderQty;

var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  starter();
});

function starter() {
  connection.query("SELECT * FROM products", function(err, result) {
    console.log("----------------------------------------" + '\r\n')
    console.log("ItemID  " + "Product  " + "            Price  ")
    console.log("----------------------------------------")
    for (var i = 0; i < result.length; i++) {
      console.log("• " + result[i].item_id + "     " + result[i].product_name + "             " + result[i].price)
    }
    beginPrompt();
  });
}

function beginPrompt() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'Id',
      message: 'What is the ID of the product you would like to buy?',
    },
    {
      type: 'input',
      name: 'units',
      message: 'How many would you like to buy?',
    }
  ]).then(function(answers) {
      orderId = answers.Id;
      orderQty = answers.units;
      console.log("ItemID selected: " + orderId+ '\r\n' + "Quantity selected: " + orderQty);
      console.log("ORDER ID IS: " + orderId)
      checkOrder();
 });
}


function checkOrder() {
  connection.query("SELECT item_id, product_name, stock_quantity FROM products", function(err, result) {
    if (err) throw err;
    if(result.stock_quantity[orderId - 1] > orderQty) {
      insufficientQty();
    } else {
      completeOrder();
    }
  });
}

function insufficientQty() {
  console.log("insufficientQty worked")
}

function completeOrder() {
  console.log("complete order worked")
}
