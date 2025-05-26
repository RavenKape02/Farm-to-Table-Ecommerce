# CMSC 100 Final Project

**AUTHORS**
- Tipan, Jiro Kristofer
- Clemente, Carl Timothy
- Manaoat, Tanya Marinelle
- Caduyac, John Raven 

## DESCRIPTION
This full-stack e-commerce web application is the final project for CMSC 100. It is built using the MERN stack (MongoDB, Express.js, React, Node.js) and showcases a simple but functional online shopping platform. The backend handles API requests, database operations, and user authentication, while the frontend provides a responsive user interface for browsing products, managing carts, placing orders, and admin functionalities.

## FEATURES
- **User Authentication**  
  Users can register, log in, and manage their profile.
- **Product Browsing**  
  Products are displayed with details such as name, price, and description.
- **Shopping Cart**  
  Users can add and remove items from their cart and proceed to checkout.
- **Order Management**  
  Orders are created upon checkout and saved in the database for users to view.
- **Admin Dashboard**  
  Admins can:
  - View, add, update, and delete products  
  - Manage users and orders  
  - Access protected routes via middleware authentication
- **API with MongoDB**  
  Backend routes are connected to a MongoDB database using Mongoose, with full CRUD operations.

## USAGE GUIDELINES
### As a **User**:
- Sign up for a new account
- Log in and browse available products
- Add products to your cart and place orders
- View order history
### As an **Admin**:
- Log in using admin credentials  
- Manage product listings (create, edit, delete) 
- View and manage orders 
- View and manage user accountss

## HOW TO RUN THE PROJECT

**REQUIREMENTS**
- Node.js and npm must be installed.
- MongoDB must be installed and running.
- `.env` file must be properly configured.

**STEPS**
1. Open a terminal and navigate to the project directory.
2. Install dependencies by running: `npm install`
3. In one terminal, start the server and connect to MongoDB by running: `npm run server`. 
4. In a **separate** terminal, start the client by running: `npm run dev`. Then, click on the local host shown in the terminal. (eg. http://localhost:5173/)
5. The API and client should now be running. Make sure MongoDB is active before running the server.
6. **Alternative option:** Instead of running the backend and frontend in two separate terminals, you can run both simultaneously using: `npm run dev:both`.

## SAMPLE CREDENTIALS

You can use the following pre-created accounts to access the app:

### 🔐 Admin Account
- **Email:** `admin@example.com`  
- **Password:** `admin123`

### 👤 Customer Account
- **Email:** `testuser@gmail.com`  
- **Password:** `useruser`

> These accounts are pre-seeded for testing purposes.  
> As a customer, you can also **sign up for a new account** if you prefer to use your own login.

## REFERENCE 

The following resources were consulted as part of the frontend design process, providing the overall aesthetic of the project’s user interface:

- https://www.behance.net/search/images?similarStyleImagesId=1286930289
- https://www.npmjs.com/package/react-icons