var mysql = require("mysql")
var inquirer = require('inquirer');

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
    console.log("Hello Admin, please find all current products for sale here: ")
    console.log("----------------------------------------" + '\r\n')
    console.log("ItemID |" + " Product |" + " Stock Qty |" + " Price |")
    for (var i = 0; i < result.length; i++) {
      console.log("• " + result[i].item_id + " | " + result[i].product_name + " | " + result[i].stock_quantity + " items | $" + result[i].price + " | ")
    }
    beginPrompt();
  });
}

function beginPrompt() {
  inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: 'Would would you like to do, Admin?',
    choices: ['View Low Inventory Stock (<50 items)', 'Add To Inventory', 'Add New Product', 'Exit']
  }).then(function(answers) {
    if (answers.choice == "View Low Inventory Stock (<50 items)") {
      viewStock();
    } else if (answers.choice == "Add To Inventory") {
      addStock();
    } else if (answers.choice == "Add New Product") {
      addProduct();
    } else if (answers.choice == "Exit") {
      exit();
    }
  });
}

function viewStock() {
  connection.query("SELECT item_id, product_name, stock_quantity FROM products", function(err, result) {
    console.log("----------------------------------------" + '\r\n')
    console.log("ItemID |" + " Product |" + " Stock Qty |")
    console.log("----------------------------------------")
    for (var i = 0; i < result.length; i++) {
      if (result[i].stock_quantity < 50) {
        console.log("• " + result[i].item_id + " | " + result[i].product_name + " | " + result[i].stock_quantity + " items | ")
      }
    }
    console.log("----------------------------------------")
    console.log("----------------------------------------")
    inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: 'Would you like to continue?',
      choices: ['Yes', 'No']
    }).then(function(answers) {
      if (answers.choice == "Yes") {
        beginPrompt();
      } else if (answers.choice == "No") {
        exit();
      }
    });
  });
}

function addStock() {
  connection.query("SELECT * FROM products", function(err, result) {
    if (err) throw err;
    inquirer.prompt([{
        type: 'list',
        name: 'product',
        message: 'What product would you like to add more stock to?',
        choices: function() {
          var choicesArr = [];
          for (var i = 0; i < result.length; i++) {
            choicesArr.push(result[i].product_name);
          }
          return choicesArr;
        }
      },
      {
        type: 'input',
        name: 'quantity',
        message: 'How many items would you like to purchase?'
      }
    ]).then(function(answers) {
      orderUpdate(answers.quantity, answers.product);
    });
  });
}

function addProduct() {
  inquirer.prompt([{
      type: 'input',
      name: 'product',
      message: 'Product name:'
    },
    {
      type: 'input',
      name: 'department',
      message: 'Department:'
    },
    {
      type: 'input',
      name: 'price',
      message: 'Purchase price:'
    },
    {
      type: 'input',
      name: 'quantity',
      message: 'Purchase qty:'
    }
  ]).then(function(answers) {
    productUpdate(answers.product, answers.department, answers.price, answers.quantity);
  });
}

function exit() {
  connection.end();
}

function orderUpdate(stock_quantity, product_name) {
  connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?", [stock_quantity, product_name],
    function(err, result) {
      if (err) throw err;
      console.log("You succesfuly added " + stock_quantity + " " + product_name + " items");
      inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Would you like to add more items of another product?',
        choices: ['Yes', 'No']
      }).then(function(answers) {
        if (answers.choice == "Yes") {
          addStock();
        } else if (answers.choice == "No") {
          exit();
        }
      });
    });
}

function productUpdate(product_name, department_name, price, stock_quantity) {
  connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [product_name, department_name, price, stock_quantity],
    function(err, result) {
      if (err) throw err;
      console.log("Your new product has been added!");
      inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Would you like to add another product?',
        choices: ['Yes', 'No']
      }).then(function(answers) {
        if (answers.choice == "Yes") {
          addProduct();
        } else if (answers.choice == "No") {
          exit();
        }
      });
    });
}
