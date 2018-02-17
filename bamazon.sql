CREATE SCHEMA `bamazon` ;

USE bamazon;

CREATE TABLE `bamazon`.`products` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(45) NULL,
  `department_name` VARCHAR(45) NULL,
  `price` DECIMAL(10,2) NULL,
  `stock_quantity` INT NULL,
  PRIMARY KEY (`item_id`));

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES 
    ('Baseball', 'Sporting Goods', 3.99, 21),
    ('Golf Bag', 'Sporting Goods', 129.99, 4),
    ('Cat Litter', 'Pet', 12.99, 11),
    ('Dog Treats', 'Pet', 4.99, 32),
    ('Playstation 4', 'Video Games', 299.99, 3),
    ('Nintendo Switch', 'Video Games', 299.99, 4),
    ('Xbox One X', 'Video Games', 399.99, 7),
    ('Guide to Javascript', 'Books', 29.99, 7),
    ('Coding for Cats', 'Books', 14.99, 20),
    ('The Secret Guide to Node.js', 'Books', 89.99, 3);

SELECT * FROM bamazon.products;