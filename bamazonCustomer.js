
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
    console.log("connected")
    startBamazon()
});

function startBamazon(){
    inquirer.prompt([
        {
            type: "list",
            message: "please select [Products] to view and purcase products or [Exit] to exit application",
            choices: ["Products", "Exit"],
            name: "choice"
        }
    ]).then(function(answer){
        if(answer.choice === "Products"){
            loadProducts();
        } else{
            connection.end();
        }
    })
}

function loadProducts(){
    // display all products available to purchase
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err
        console.table(res)
        // run function to allow customer to purchase a product
        buyProducts()
    })
}

function buyProducts(){
    // prompt user with id of product they would like to purchase and amount
    inquirer.prompt([
        {
            type: "input",
            message: "What is the id of the product you would like to purchase?",
            name: "productId"
        },
        {
            type: "input",
            messge: "How many would you like to purchase?",
            name: "purchaseAmount"
        }
    ]).then(function(answers){
        // retrieve stock_quantity by id
        connection.query("SELECT * FROM products WHERE ?", {id: answers.productId}, function(err, res){
            if(err) throw err
            // if stock_quantity is >= answers.purchaseAmount
            if(res[0].stock_quantity >= parseInt(answers.purchaseAmount)){
                //  subtract stock_quantity by answers.purchaseAmount
                var newQuantity = res[0].stock_quantity - parseInt(answers.purchaseAmount)
                var totalSold = parseInt(answers.purchaseAmount) * res[0].price
                var currentSales = res[0].product_sales
                console.log("Price "+res[0].price)
                console.log("purchase amount "+ parseInt(answers.purchaseAmount))
                console.log(totalSold)
                connection.query("UPDATE products SET ? WHERE ?",
                [
                        {
                            stock_quantity: newQuantity,
                            product_sales: totalSold + currentSales
                        },
                        {
                            id: answers.productId
                        }
                ], function(err){
                    if(err) throw err
                    console.log("Item purchased")
                    startBamazon()
                })
            } else{
                // else log error message and run buyProducts()
                console.log("You can't buy that many")
                buyProducts()
            }        
        })
    })  
}
