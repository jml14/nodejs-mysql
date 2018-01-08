var inquirer = require('inquirer');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'bamazon'
});
connection.connect();

var product_id = 0;
var quantity = 0;

function updateQuantity(stock_quantity, quantity, product_id){
	var update_query = 'UPDATE products set stock_quantity = ' + (stock_quantity - quantity).toString() + ' where item_id = ' + product_id;
	connection.query(update_query, function (error, results, fields) {
  		if (error) throw error;
	});
}

function makeTransaction(product_id, quantity){
	validate_query = 'SELECT stock_quantity from products where item_id = ' + product_id
	var update_query = '';
	connection.query(validate_query, function (error, results, fields) {
  	if (error) throw error;
  	stock_quantity = results[0].stock_quantity;
  	if (stock_quantity >= quantity) {
  		updateQuantity(stock_quantity, quantity, product_id);
  		connection.end();
  	}
  	else {
  		console.log('not enough units left.');
  		connection.end();
  		return;
  	}
  	});
	return;
}

var questions = [
	{
    message: "Which Product ID would you like?",
    type: "input",
    name: "product"
	},
    {
    message: "How Many?",
    type: "input",
    name: "quantity"
    }];

inquirer.prompt(questions).then(answers => {
	makeTransaction(answers['product'], quantity = answers['quantity']);
});

