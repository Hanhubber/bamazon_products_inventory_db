// Declare required modules here
// MySQL Node module
var mysql = require('mysql');
// Inquirer module for user input prompts
var inquirer = require('inquirer');
// Keys module for storing MySQL server login information
var keys = require('./keys');
// Custom module with some useful functions
var usefunc = require('./usefunc');

// MySQL Module connection configuration
var connection = mysql.createConnection({
    host: keys.host,
    port: keys.port,
    user: keys.user,
    password: keys.password,
    database: keys.database
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    usefunc.lineBreak(1);
});

// Global variables
var itemIds = [];
var products;

// Functions
// Query latest from products table and store in object 'products'
function queryProducts(arg) {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        products = res;
        // If 'list' argument is set, then call the listProducts() function
        if (arg === 'list') {
            listProducts(products);
        }
    });
}

// Query the item_id and check it's qty to see if there are enough available
function buyProduct(id, qty) {
    connection.query('SELECT * FROM products WHERE item_id = ?', [id], function(err, res) {
        if (err) throw err;
        if (res[0].stock_quantity < qty) {
            console.log("There is not enough of that product in stock. Please try again.");
            usefunc.lineBreak(1);
            queryProducts('list');
        }
        else {
            var price = res[0].price;
            connection.query('UPDATE products SET ? WHERE ?',
            [
                {
                    stock_quantity: res[0].stock_quantity - qty
                },
                {
                    item_id: id
                }
            ], function(err, res) {
                if (err) throw err;
                console.log("Total Cost of Purchase: $" + price * qty);
                console.log("Thank you for shopping!");
            });
        }
    });
}

// List the products on screen.
function listProducts() {
    // Iterate through the query results and save the maximum length of the item_id and product_name fields to an integer variable
    var maxNameLength = 0;
    var maxIdLength = 0;
    for (i = 0; i < products.length; i++) {
        if (maxNameLength < products[i].product_name.length) {
            maxNameLength = products[i].product_name.length;
        }
        if (maxIdLength < String(products[i].item_id).length) {
            maxIdLength = String(products[i].item_id).length;
        }
    }
    // Create a string by joining a new array filled with empty characters equal to fillerChars
    // Iterate through the query results and console.log each product's information
    for (i = 0; i < products.length; i++) {
        // Set the nameFiller length to the maximum name length minus the current name length
        var nameFiller = " ".repeat(maxNameLength - products[i].product_name.length);
        // Set the idFiller length to the max id length minus the current id length
        var idFiller = " ".repeat(maxIdLength - String(products[i].item_id).length);
        // Console log the product information with our fillers between each column
        console.log("Item ID: " + products[i].item_id + idFiller + " || Product: " + products[i].product_name + nameFiller + " || Price: $" + products[i].price);
        // Lastly, add the itemId to array ItemIds if it is not already stored there.
        var id = parseInt(products[i].item_id);
        if (itemIds.indexOf(id) === -1) {
            itemIds.push(id);
        }
    }
    promptSale();
}

// Prompts the user for purchase information.
function promptSale(item_id) {
    usefunc.lineBreak(1);
    // If the argument item_id is passed through just prompt the user for the qty
    if (item_id) {
        inquirer.prompt({
            name: "qty",
            type: "input",
            message: "How many would you like to purchase?"
        }).then(function(answer) {
            var qty = parseInt(answer.qty);
            if (isNaN(qty)) {
                console.log("That is not a valid number.");
                usefunc.lineBreak(1);
                listProducts();
            }
            else {
                console.log("You chose to purchase " + qty);
                buyProduct(id, qty);
            }
        });
    }
    // Else prompt the user for the item_ID and the qty
    else {
        inquirer.prompt({
            name: "id",
            type: "input",
            message: "What is the item ID of the product you would like to purchase?"
        }).then(function(answer) {
            var id = parseInt(answer.id);
            if (itemIds.indexOf(id) === -1) {
                console.log("Please enter a valid item ID");
                usefunc.lineBreak(1);
                promptSale();
            }
            else {
                inquirer.prompt({
                    name: "qty",
                    type: "input",
                    message: "How many would you like to purchase?"
                }).then(function(answer) {
                    var qty = parseInt(answer.qty);
                    if (isNaN(qty)) {
                        console.log("That is not a valid number.");
                        usefunc.lineBreak(1);
                        promptSale(id);
                    }
                    else {
                        console.log("You chose to purchase " + qty);
                        buyProduct(id, qty);
                    }
                });
            }
        });
    }
}

// Initialize the app by running the queryProducts function.
queryProducts('list');