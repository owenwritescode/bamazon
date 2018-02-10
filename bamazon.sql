-- Creates the DB
CREATE DATABASE bamazon_DB;

-- Uses the DB
USE bamazon_DB;

-- Creates the product table with variable columns
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

-- Inserts initial data into table
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('couch', 'furniture', 1000, 10),
	     ('snowboard', 'sporting', 600, 5),
       ('compound bow', 'hunting', 500, 20),
       ('macbook', 'electronics', 1500, 10),
       ('router', 'networking', 100, 3),
       ('GPS', 'travel', 200, 50),
       ('Bluray', 'entertainment', 200, 10),
       ('Duvet', 'bedding', 60, 6),
       ('Hoodie', 'clothing', 15, 30),
       ('Deodorant', 'essentials', 8, 1000);

-- Allows a quick view of table
SELECT * FROM products;