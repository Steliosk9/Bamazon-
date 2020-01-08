DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
id INT AUTO_INCREMENT NOT NULL,
product_name VARCHAR(255) NOT NULL,
department VARCHAR(255) NOT NULL,
price DECIMAL(10, 2) NOT NULL,
stock_quantity INT(10),
PRIMARY KEY(id)
);

CREATE TABLE departments (
department_id INT AUTO_INCREMENT NOT NULL,
department_name VARCHAR(255) NOT NULL,
over_head_costs DECIMAL(10, 2) NOT NULL,
PRIMARY KEY(department_id)
);
INSERT INTO departments(department_name, over_head_costs)
VALUES("AUTO", 1000000), ("Home and Garden", 1000), ("Electronics", 5000), ("Books", 500), ("Toys and Games", 1000);

INSERT INTO products(product_name, department, price, stock_quantity)
VALUES("Corvette", "AUTO", 50000.00, 5), ("Garden Hose", "Home and Garden", 20.00, 100), ("PS4", "Electronics", 249.99, 50), ("Uncharted 4", "Electronics", 29.99, 100), ("Avengers Endgame", "Electronics", 19.99, 100), ("The Lord of the Rings: Fellowship of the Ring", "Books", 9.99, 100), ("Cataan", "Toys and Games", 40.00, 100), ("Pandemic", "Toys and Games", 35.00, 100), ("Shovel", "Home and Garden", 15.98, 100),("The Lord of the Rings: Return of the King", "Books", 12.99, 100);
ALTER TABLE products
ADD COLUMN product_sales DECIMAL(10, 2) DEFAULT 0;