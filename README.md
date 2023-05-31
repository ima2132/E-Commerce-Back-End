# E-Commerce Back-End

## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Demonstration](#demonstration)

## Description 
E-commerce dominates the electronics industry, as it offers a range of services catering to businesses, irrespective of their size. Given the widespread use of these platforms, it's important for developers to grasp the basic structure of e-commerce websites.

The objective of this project is to build the back-end for an e-commerce site. The application uses a working `Express.js` API and configures it to use `Sequelize` to interact with a `MYSQL` database. 

This software enables a manager at an online retail business to leverage cutting-edge technology in order to maintain a record of their products and services.

## Installation 
To install the program, you will need to have `VS Code` and `Node.js` installed. First, clone the repository. You will then need to install dependencies in order to use the application.

To utilize the e-commerce back end application, run the following command in your terminal:

`npm install`

After installing the necessary dependencies, it's required to populate your database with initial data to properly run the application using the SQL schema. This can be achieved by executing the following command:

`mysql -u root -p <db/schema.sql`

Proceed to seed your data by entering the command:

`npm run seed`

* Please note that you'll need to include your password, database, and user information in your .env file (located in the root directory in a file called `.env`). This is not supplied with the repository.

You can then start the application by running the command `node server.js`.


## Usage
In order to operate this application, it is required to use an `API` testing tool such as `Insomnia` or `Postman`. After initiating your server, you may proceed to make your requests. 

The demo below uses `Insomnia` to make examples of requests.

## License 
Please refer to the LICENSE listed in the repo.

## Demonstration 
Click on the link below to watch a video demonstration of how to use the application:
