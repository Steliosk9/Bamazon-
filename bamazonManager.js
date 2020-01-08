<<<<<<< HEAD
const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    post: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err){
    if(err) throw err
    console.log("connected");
    bamazonManager()
});

function bamazonManager(){
    inquirer.prompt([
        {
            type: "list",
            message: "please select what you would like to do",
            choices: ["View All Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "startChoice"
        }
    ]).then(function(answer){
        switch(answer.startChoice){
            // view products for sale
            case "View All Products":
                return view();
            // view low inventory
            case "View Low Inventory":
                return lowInventory();
            // add to inventory
            case "Add to Inventory":
                return addInventory();
            // add new product
            case "Add New Product":
                return addProduct();
            // exit bamazonManager
            case "Exit":
                return connection.end();
        }
    });
}

// function to view all products
function view(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err
        console.table(res);
        bamazonManager();
    })
}

// function to view all products with low inventory
function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 10", function(err, res){
        if(err) throw err
        console.table(res);
        bamazonManager();
    })
}

// function to add to inventory
function addInventory(){
    inquirer.prompt([
        {
            type:"input",
            message: "Please enter the id of the product you would like to add inventory to",
            name: "productId"
        },
        {
            type: "input",
            message: "How much inventory would you like to add?",
            name: "inventory"
        }
    ]).then(function(answers){
        // check to see if answers.inventory is a number
        if(isNaN(answers.inventory)){
            console.log("Please enter a valid inventory number")
            addInventory();
        // check to see if answers.productId is a number
        } else if(isNaN(answers.productId)){
            console.log("Please enter a valid productId")
            addInventory();
        } else{
            // retrieve current inventory
            connection.query("SELECT * FROM products WHERE ?", {id: answers.productId}, function(err, res){
                if(err) throw err
                let newInventory = parseInt(answers.inventory)+res[0].stock_quantity;
                 // update inventory
                connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newInventory
                    },
                    {
                        id: answers.productId
                    }
                ], function(err){
                    if(err) throw err
                    console.log("Inventory added")
                    bamazonManager();
                })
            })
        }
    })
}

// function to add a new product
function addProduct(){
    connection.query("SELECT department_name FROM departments", function(err, res){
        if(err) throw err
        const departments = [];
        for(var i = 0; i<res.length; i++){
            departments.push(res[i].department_name)
        }
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the Product Name",
                name: "productName"
            },
            {
                type: "list",
                message: "Select the Product Department",
                choices: departments,
                name: "productDepartment"
            },
            {
                type: "input",
                message: "Enter the Product Price",
                name: "productPrice"
            },
            {
                type: "input",
                message: "Enter the Inventory Amount",
                name: "productInventory"
            }
        ]).then(function(answers){
            // check to see if productPrice and productInventory are a number
            if(!isNaN(parseInt(answers.productPrice)) && !isNaN(parseInt(answers.productInventory))){
                connection.query("INSERT INTO products SET?",
                    {
                        product_name: answers.productName,
                        department: answers.productDepartment,
                        price: answers.productPrice,
                        stock_quantity: answers.productInventory
                    }, function(err, res){
                        if(err) throw err
                        console.log("Product Added")
                        bamazonManager();
                    })

            } else{
                console.log("Please enter a valid price and inventory")
                addProduct()
            }
        })
    });
}

=======
// SETUP
// =====================================================================================
var mysql = require('mysql');
var inquirer = require('inquirer');
var chalk = require('chalk');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: '',
    user: 'root',
    password: 'password',
    database: 'bamazon'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connection successful');
    // display all items from database once mysql connection has been established
    resetData();
    displayMenu();
});

// GLOBAL VARIABLES
// =====================================================================================
var itemToUpdate = {};
var itemToDelete = {};

// FUNCTIONS
// =====================================================================================
var resetData = function() {
    itemToUpdate = {};
    itemToDelete = {};
}

var displayMenu = function() {
    inquirer.prompt({
        name: 'action',
        type: 'rawlist',
        message: '\n\nChoose an action:',
        choices: [
            'View Products for Sale',
            'View Low Inventory',
            'Add to Inventory',
            'Add New Product',
            'Remove A Product'
        ]
    }).then((answer) => {
        switch (answer.action) {
            case 'View Products for Sale':
                viewActiveProducts();
            break;
            case 'View Low Inventory':
                viewLowInventory();
            break;
            case 'Add to Inventory':
                addToInventory();
            break;
            case 'Add New Product':
                addNewProduct();
            break;
            case 'Remove A Product':
                deleteProduct();
            break;
        }
    });
};

var viewActiveProducts = function() {
    connection.query(`SELECT * FROM products`, (err, res) => {
        var listTable = new Table({
            head: ['Item ID', 'Product Name', 'In Stock', 'Price'],
            colWidths: [10, 45, 10, 12]
        });

        for (var i = 0; i < res.length; i++) {
            listTable.push([res[i].item_id, res[i].product_name, res[i].stock_quantity, `$${res[i].price}`]);
            // console.log(chalk.blue.bold(`\n\tItem ID: ${res[i].item_id}\n\tProduct Name: ${res[i].product_name}\n\tPrice: $${res[i].price}\n`));
        }

        console.log(`\n\n${listTable.toString()}\n\n`);
        connection.end();
    });
};

var viewLowInventory = function() {
    connection.query(`SELECT * FROM products WHERE stock_quantity < 5 ORDER BY stock_quantity DESC`, (err, res) => {
        if (res.length > 0) {
            var listTable = new Table({
                head: ['Item ID', 'Product Name', 'In Stock', 'Price'],
                colWidths: [10, 45, 10, 12]
            });

            for (var i = 0; i < res.length; i++) {
                listTable.push([res[i].item_id, res[i].product_name, res[i].stock_quantity, `$${res[i].price}`]);
                // console.log(chalk.blue.bold(`\n\tItem ID: ${res[i].item_id}\n\tProduct Name: ${res[i].product_name}\n\tPrice: $${res[i].price}\n`));
            }

            console.log(`\n\n${listTable.toString()}\n\n`);

        } else {
            console.log(chalk.blue.bold('\n\tNo low-stock items!\n'));
        }
        connection.end();
    });
};

var addToInventory = function() {
    askForID();
};

var addNewProduct = function() {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter the product name:'
        },
        {
            name: 'department',
            type: 'input',
            message: 'Enter the product department:'
        },
        {
            name: 'price',
            type: 'input',
            message: 'Enter the product price:',
            validate: (value) => {
                if (!isNaN(value) && value > 0) {
                    return true;
                } else {
                    console.log(chalk.red(` => Oops, please enter a number greater than 0`));
                    return false;
                }
            }
        }, 
        {
            name: 'stockNum',
            type: 'input',
            message: 'Enter the number of items in stock:',
            validate: (value) => {
                if (!isNaN(value) && value > 0) {
                    return true;
                } else {
                    console.log(chalk.red(` => Oops, please enter a number greater than 0`));
                    return false;
                }
            }
        }
    ]).then((answers) => {
        connection.query('INSERT INTO products SET ?', {
            product_name: answers.name,
            department_name: answers.department,
            price: answers.price,
            stock_quantity: answers.stockNum
        }, (err, res) => {
            if (err) throw err;
            console.log(chalk.blue.bold('\n\tItem successfully added!'));
            viewActiveProducts();
        });
    });
};

var deleteProduct = function() {
    inquirer.prompt({
        name: 'itemID',
        type: 'input',
        message: 'Enter the ID of the product you\'d like to remove:'
    }).then((answer) => {
        connection.query('SELECT * FROM products WHERE ?', { item_id: answer.itemID }, (err, res) => {
            inquirer.prompt({
                name: 'confirm',
                type: 'confirm',
                message: `You would like to delete` + chalk.blue.bold(` '${res[0].product_name}'. `) + `Is this correct?`
            }).then((answer) => {
                if (answer.confirm) {
                    itemToDelete = {
                        item_id: res[0].item_id
                    };
                    connection.query('DELETE FROM products WHERE ?', { item_id: itemToDelete.item_id }, (err, res) => {
                        if (err) throw err;
                        console.log(chalk.blue.bold('\n\tItem successfully removed!'));
                        viewActiveProducts();
                    });
                } else {
                    deleteProduct();
                }
            });
        });
    });
};

var askForID = function() {
    inquirer.prompt({
        name: 'itemID',
        type: 'input',
        message: 'Enter the ID of the item you\'d like to update:',
        // validate input is number from 1-10
        validate: (value) => {
            if (!isNaN(value) && (value > 0 && value <= 10)) {
                return true;
            } else {
                console.log(chalk.red(' => Please enter a number from 1-10'));
                return false;
            }
        }
        // select all rows where ID = user's input
    }).then((answer) => {
        connection.query('SELECT * FROM products WHERE ?', { item_id: answer.itemID }, (err, res) => {
            confirmItem(res[0].product_name, res);
        });
    });
};

var confirmItem = function(product, object) {
    inquirer.prompt({
        name: 'confirmItem',
        type: 'confirm',
        message: `You chose` + chalk.blue.bold(` '${product}'. `) + `Is this correct?`
    }).then((answer) => {
        if (answer.confirmItem) {
            itemToUpdate = {
                item_id: object[0].item_id,
                product_name: object[0].product_name,
                department_name: object[0].department_name,
                price: object[0].price,
                stock_quantity: object[0].stock_quantity,
                product_sales: object[0].product_sales
            };
            askHowMany();
        } else {
            askForID();
        }
    });
};

var askHowMany = function() {
    inquirer.prompt({
        name: 'howMany',
        type: 'input',
        message: 'Enter the quantity you would like to add:',
        validate: (value) => {
            if (!isNaN(value) && value > 0) {
                return true;
            } else {
                console.log(chalk.red(' => Oops, please enter a number greater than 0'));
                return false;
            }
        }
    }).then((answer) => {
        itemToUpdate.howMany = answer.howMany;
        connection.query('UPDATE products SET ? WHERE ?', [
            {
                stock_quantity: Number(itemToUpdate.stock_quantity) + Number(answer.howMany)
            },
            {
                item_id: itemToUpdate.item_id
            }
        ], (err, res) => {
            console.log(chalk.blue.bold(`\n\tInventory updated! '${itemToUpdate.product_name}' now has ${Number(itemToUpdate.stock_quantity) + Number(itemToUpdate.howMany)} items in stock\n`));
            connection.end();
        });
    });
}
>>>>>>> 67c9e85039e704b6da70667bb804c4b8b2ad95df
