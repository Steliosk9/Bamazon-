var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table3');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
  });
 
  connection.connect();

   var display = function() {
  connection.query("SELECT * FROM products",function(err,res){
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    console.log("");
    console.log("========================");
    console.log("Welcome to Bamazon");
    console.log("========================");
    console.log("");
 
  
  // instantiate
  var table = new Table({
      head: ['Product id', 'Product Description','stock','Price']
    , colWidths: [8, 30 ,20, 8]
  });
   
  // table is an Array, so you can `push`, `unshift`, `splice` and friends
  for(var i = 0; i < res.length; i++) {
  table.push([res[i].id, res[i].name, res[i].stock_quantity, res[i].price]);
  }

  console.log(table.toString());
  console.log("");
     startPrompt();
});

};
   
// display();


function startPrompt() {

  inquirer.prompt([{

    type: "input",
    name: "product",
    message: "please add the id of the product you are interesting to purchase"
  }])
 .then(function(response){
   var choise = response.product;
   connection.query("SELECT * FROM products WHERE id =?",choise ,function(err,res){
     if (err)throw err;
     if (res.length === 0){
       console.log("Product doesnt exist,please enter a valid choise");

       startPrompt();

     }else{
      inquirer.prompt({
        type:"Input",
        name:"quantity",
        message:"How many items would you like to purchase?"
      })
      .then(function(responseTwo){
        var number = responseTwo.quantity;
        if(number > res[0].stock_quantity){
          console.log("oops!!!...Unfortunately we only have "+ res[0].stock_quantity +"Items from the selected product");
          startPrompt();
          } else {
          console.log("");
          console.log(res[0].name + " purchased");
          console.log("price " +"$"+ res[0].price);

          var newQuantity = res[0].stock_quantity - number;
          connection.query(
            "UPDATE products SET stock_quantity = " +
              newQuantity +
              " WHERE id = " +
              res[0].id,
            function(err, resUpdate) {
              if (err) throw err;
              console.log("");
              console.log("Your Order has been Processed");
              console.log("Thank you for Shopping with us...!");
              console.log("");
              connection.end();
            }
          )}
      })
     }
   })
  })
} 

display();

