CREATE TABLE products (
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(30),
department_name VARCHAR(30),
price INTEGER(11),
stock_quantity INTEGER(11),
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cricket Bat", "Sports", "135", "50");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("E-Collar", "Pet Supplies", "49", "100");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cricket Ball", "Sports", "15", "100");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("NY Yankees Cap", "Mens Fashion", "35", "20");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nudie Jeans", "Mens Fashion", "339", "12");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Beef Jerkey", "Snacks", "6", "100");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chocolate Almonds", "Snacks", "8", "30");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dog Bed", "Pet Supplies", "55", "40");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Baseball Bat", "Sports", "45", "500");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Basketball", "Sports", "49", "500");
