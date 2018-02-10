
var mysql = require('mysql');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon_db'
});


var numberOfProductTypes = 0;

connection.connect(function(err) {
    if (err) throw err;
    new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM products', function(err, res) {
            if (err) reject(err);
            resolve(res);
            console.log('Welcome to Bamazon! Here are our products:')
        });

    }).then(function(result) {
        result.forEach(function(item) {
            numberOfProductTypes++;
            console.log('Item ID: ' + item.item_id + ' || Product Name: ' + item.product_name + ' || Price: ' + item.price);
        });

    }).then(function() {
        return enterStore();

    }).catch(function(err) {
        console.log(err);
    });
});


function enterStore() {
    inquirer.prompt([{
        name: 'entrance',
        message: 'Hello, start shopping?',
        type: 'list',
        choices: ['Yes', 'No']
    }]).then(function(answer) {
        if (answer.entrance === 'Yes') {
            menu();
        } else {
            console.log('See you next time.');
            connection.destroy();
            return;
        }
    });
}

function menu() {
    return inquirer.prompt([{
        name: 'item',
        message: 'Please enter the item number of the product you wish to purchase.',
        type: 'input',
        validate: function(value) {
            if ((isNaN(value) === false) && (value <= numberOfProductTypes)) {
                return true;
            } else {
                console.log('\nPlease enter a valid ID.');
                return false;
            }
        }
    }, {
        name: 'quantity',
        message: 'How many of the product would you like to purchase today?',
        type: 'input',
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log('\nPlease enter a valid quantity.');
                return false;
            }
        }
    }]).then(function(answer) {
        return new Promise(function(resolve, reject) {
            connection.query('SELECT * FROM products WHERE ?', { item_id: answer.item }, function(err, res) {
                if (err) reject(err);
                resolve(res);
            });
        }).then(function(result) {
            var savedData = {};
            if (parseInt(answer.quantity) <= parseInt(result[0].stock_quantity)) {
                savedData.answer = answer;
                savedData.result = result;
            } else if (parseInt(answer.quantity) > parseInt(result[0].stock_quantity)) {
                console.log('Insufficient quantity!');
            } else {
                console.log('An error occurred, encrypting system files with SHA-256/TwoFish algorithm until $2,500 in BitCoin is sent to the following address: X__12_534beep_boop_jetsons_orbit_beep_beep_boop_x23_HAL');
            }
            return savedData;
        }).then(function(savedData) {
            if (savedData.answer) {
                var updatedQuantity = parseInt(savedData.result[0].stock_quantity) - parseInt(savedData.answer.quantity);
                var itemId = savedData.answer.item;
                var totalCost = parseInt(savedData.result[0].price) * parseInt(savedData.answer.quantity);
                connection.query('UPDATE products SET ? WHERE ?', [{
                    stock_quantity: updatedQuantity
                }, {
                    item_id: itemId
                }], function(err, res) {
                    if (err) throw err;
                    console.log('Your total order cost $' + totalCost + '. Thank you v much! ');
                    connection.destroy();
                });
            } else {
                enterStore();
            }
        }).catch(function(err) {
            console.log(err);
            connection.destroy();
        });
    }).catch(function(err) {
        console.log(err);
        connection.destroy();
    });
}
