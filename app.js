const prompt = require('prompt-sync')();

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});
const Customer = require('./models/customer');

console.log(`Welcome to the CRM!`);

// CRM menu:
function displayMenu() {
    console.log(`What would you like to do?`);
    console.log(`1. Create a customer`);
    console.log(`2. View all customers`);
    console.log(`3. Update a customer`);
    console.log(`4. Delete a customer`);
    console.log(`5. Exit application`);
    return prompt(`Number of action to run: `);
};



// CREATE
async function createCustomer() {
    const name = prompt(`Name of customer: `);
    const age = prompt(`Age of customer: `);
    if (!name) {
        console.log(`Name is required.`);
        return;
    }
    if (isNaN(age)) {
        console.log(`Valid age is required.`);
        return;
    }
    const customer = new Customer({ name, age });
    await customer.save();
    console.log(`Customer created: ${customer.name}`);
    console.log(`Press enter to return to menu.`);
    prompt();
};


// 2. View all customers:
async function viewAllCustomers() {
    const customers = await Customer.find();
    customers.forEach((customer) => {
        console.log(`id: ${customer.id} -- Name: ${customer.name}, Age: ${customer.age}`);
    });
    console.log(`Press enter to return to menu.`);
    prompt();
};

// 3. Update a customer:
async function updateCustomer() {
    console.log(`Below is a list of customers:`);
    const customers = await Customer.find();
    customers.forEach(customer => {
        console.log(`id: ${customer.id} -- Name: ${customer.name}, Age: ${customer.age}`);
    });
    const update = prompt(`Copy and paste the id of the customer you would like to update here: `);
    if (update) {
        const customer = await Customer.findById(update);
        if (customer) {
                const newName = prompt(`New name (leave blank to keep ${customer.name}): `);
                const newAge = prompt(`New age (leave blank to keep ${customer.age}): `);
                if (newName) customer.name = newName;
                if (newAge) customer.age = newAge;
                await customer.save();
                console.log(`Customer updated: ${customer.name}`);
            }
        }
        console.log(`Press enter to return to menu.`);
        prompt();
    };

// 4. Delete a customer:
async function deleteCustomer() {
    console.log(`Below is a list of customers:`);
    const customers = await Customer.find();
    customers.forEach(customer => {
        console.log(`id: ${customer.id} -- Name: ${customer.name}, Age: ${customer.age}`);
    });
    const id = prompt(`Copy and paste the id of the customer you would like to delete here: `);
    if (id) {
        const customer = await Customer.findByIdAndDelete(id);
        if (customer) {
            console.log(`Customer deleted: ${customer.name}`);
        } else {
            console.log(`Customer not found.`);
            return;
        }
    }
    console.log(`Press enter to return to menu.`);
    prompt();
};



// Main program:
async function main() {
    while (true) {
        const choice = displayMenu();
        if (choice === '1') {
            await createCustomer();
        } else if (choice === '2') {
            await viewAllCustomers();
        } else if (choice === '3') {
            await updateCustomer();
        } else if (choice === '4') {
            await deleteCustomer();
        } else if (choice === '5') {
            console.log(`Exiting application...`);
            mongoose.connection.close();
            break;
        } else {
            console.log(`Invalid choice. Please try again.`);
        }
    }
}

main();