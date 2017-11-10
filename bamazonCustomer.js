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
  connection.query("SELECT product_name FROM products", function(err, result) {
    console.log("--------------------" + '\r\n')
    console.log("ITEMS FOR SALE" + '\r\n')
    console.log("--------------------" + '\r\n')
    for (var i = 0; i < result.length; i++) {
      console.log("• " + result[i].product_name)
    }
    // console.log(result)
  });
}
