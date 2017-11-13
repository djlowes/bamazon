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
    console.log("ItemID |" + " Product |" + " Price |")
    console.log("----------------------------------------")
    for (var i = 0; i < result.length; i++) {
      console.log("• " + result[i].item_id + " | " + result[i].product_name + " | " + result[i].price + " | ")
    }
    beginPrompt();
  });
}

function beginPrompt() {
  inquirer.prompt([{
      type: 'input',
      name: 'Id',
      message: 'What is the ID of the product you would like to buy?',
      validate: function(input) {
        if (input <= 20) return true;
        return "Please enter an ID number correlating to an item for sale";
      }
    },
    {
      type: 'input',
      name: 'units',
      message: 'How many would you like to buy?',
      validate: function(input) {
        if (input.match(/[0-9]/)) return true;
        return "Please enter a quantity of item you would like to buy";
      }
    }
  ]).then(function(answers) {
    orderId = answers.Id;
    orderQty = answers.units;
    console.log("ItemID selected: #" + orderId + '\r\n' + "Quantity selected: " + orderQty + " items");
    checkOrder();
  });
}

function checkOrder() {
  connection.query("SELECT item_id, product_name, stock_quantity FROM products", function(err, result) {
    if (err) throw err;
    if ((orderQty) > (result[orderId - 1].stock_quantity)) {
      insufficientQty();
    } else if (orderQty == 0) {
      console.log('\r\n' + '\r\n' + '\r\n' + "You need to select at least one item in order to checkout. Try again: " + '\r\n' + '\r\n' + '\r\n');
      starter();
    } else {
      updateDB();
    }
  });
}

function insufficientQty() {
  console.log('\r\n' + '\r\n' + '\r\n' + "Insufficient quantity. We could not place your order. Feel free to keep shopping." + '\r\n' + '\r\n' + '\r\n');
  inquirer.prompt({
    type: 'list',
    name: 'continue',
    message: 'Would you like to keep shopping?',
    choices: ['Yes', 'No']
  }).then(function(answers) {
    if (answers.continue == "Yes") {
      beginPrompt();
    } else {
      connection.end();
    }
  });
}

function updateDB() {
  var query = "UPDATE products SET stock_quantity = stock_quantity - " + orderQty + " WHERE item_id = " + orderId;
  connection.query(query, function(err, result) {
    completeOrder();
  });
}

function completeOrder() {
  var query = "SELECT * FROM products WHERE item_id = " + orderId;
  connection.query(query, function(err, result) {
    var price = (orderQty * result[0].price);
    console.log("----------------------------------------" + '\r\n');
    console.log("CONGRATULATIONS ON A SUCCESSFUL PURCHASE!" + '\n' + "Your order details are below:" + '\r\n');
    console.log("Item: " + result[0].product_name);
    console.log("Qty: " + orderQty);
    console.log("Price: $" + price);
    console.log("----------------------------------------")
    connection.end();
  });
}
