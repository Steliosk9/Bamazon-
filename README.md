# Bamazon
Bamazon is a **Node** application that runs accross three different js files
- bamazonCustomer
- bamazonManager
- bamazonSupervisor

This application utilizes *mysql* as a database as well as the npm packages of 
- mysql
- inquirer

## bamazonCustomer
bamazonCustomer allows the user to.. 
- view all products for sale
- purchase products based on product **id**
When the user views all products the product **id**, **product_name**, **department**, **price**, **stock_quantity**, and **product_sales** are displayed for each available product.
If the user purchases a product the **stock_quantity** and **product_sales** are updated based on the price of the product and amount purchased.
![bamazon customer](./images/bamazon-customer.png)

## bamazonManager
bamazonManager allows the user to..
- View All Products
- View Low Inventory
- Add to Inventory
- Add New Product
### View All Products
Like bamazonCustomer this displays all available products with the same information
![View Product](./images/manager-view.png)

### View Low Inventory
This displays all products that have an **stock_quantity** that is less than 10
![Low Inventory](./images/manager-low.png)

### Add to Inventory
This allows the manager to select a product by **id** and increase the **stock_quantity**
![Add Inventory](./images/manager-add-inventory.png)

### Add New Product
This prompts the manager to create a new product by entering the products **product_name**, **department**, **price**, and **stock_quantity**
![Add Product](./images/manager-add-product.png)

## bamazonSupervisor
bamazonSupervisor allows the user to.. 
- View Product Sales by Department
- Create New Department

### View Product Sales by Department
This joins the products and departments tables and displays departments.department_id, departments.department, departments.over_head_costs, products.product_sales, and creates a temporary column of total_profit.  over_head_costs displays the total overhead cost of each department, product_sales is the calculated total of the total sales by each department, total_profit is calculated by subtracting over_head_costs from product_sales.
![View Sales](./images/supervisor-sales.png)

### Create New Department
This prompts the user to add to the departments table by entering **department** and **over_head_costs**.
This then will update the possible selection of departments available when the bamazonManager enters a new product.
![Add Department](./images/supervisor-dept.png)




