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

