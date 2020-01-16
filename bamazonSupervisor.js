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
    bamazonSupervisor()
});

function bamazonSupervisor(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"],
            name: "choice"
        }
    ]).then(function(answer){
        switch(answer.choice){
            case "View Product Sales by Department":
                return productSales();
            case "Create New Department":
                return newDepartment();
            case "Exit":
                return connection.end();
        }
    });
}

function productSales(){
    // calculate product sales by department
    connection.query("SELECT departments.department_id, products.department, departments.over_head_costs, SUM(products.product_sales) as product_sales, SUM(products.product_sales) - departments.over_head_costs as total_profit FROM products INNER JOIN departments ON products.department = departments.department_name GROUP BY departments.department_id", function(err, res){
        if(err) throw err
        console.table(res)
        bamazonSupervisor();
    }); 
};

function newDepartment(){
    // set departments in an array
    connection.query("SELECT * FROM departments", function(err, res){
        if(err) throw err
        const departments = []
        // loop through department_name and push into departments
        for(var i = 0; i < res.length; i++){
            departments.push(res[i])
        }
        inquirer.prompt([
            {
                type: "input",
                message: "Department Name",
                name: "name"
            },
            {
                type: "input",
                message: "Overhead Cost",
                name: "overhead"
            }
        ]).then(function(answer){
            // set overheadCost to a int
            let overheadCost = parseInt(answer.overhead);
            // check if answer.overhead is an existing department and overheadCost is a number
            if(departments.indexOf(answer.name)===-1 && !isNaN(overheadCost)){
                connection.query("INSERT INTO departments SET?",
                {
                    department_name: answer.name,
                    over_head_costs: overheadCost
                }, 
                function(err, res){
                    if(err) throw err
                    console.log("Department Added");
                    bamazonSupervisor();

                })
            } else {
                console.log("Please enter a valid department name and overhead cost");
                newDepartment();
            }
        })
    })
}