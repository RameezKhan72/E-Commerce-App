This repository contains the complete source code for a full-stack e-commerce mobile application built with React Native (Expo) for the frontend and Node.js (Express) with MongoDB for the backend.



The application provides a seamless user experience for browsing products, managing a persistent shopping cart, placing orders, and managing user profiles.



Repository Structure



The project is organized into two main directories as per the assignment guidelines:



ecommerce-app/

├── frontend/          (React Native Expo app)

├── backend/           (Node.js Express server)

└── README.md





Backend Setup



Prerequisites



Node.js (v18 or later recommended)



MongoDB: A local MongoDB server instance must be running.



1\. Installation



Navigate to the backend directory and install the required dependencies:



cd backend

npm install





2\. Database Setup



This project is configured to connect to a local MongoDB instance.



Connection String: The connection URI is defined in backend/server.js. The default is mongodb://127.0.0.1:27017/ecommerce.



Ensure MongoDB is Running: Before starting the server, make sure your local MongoDB service is active. On Windows, you can check this in the "Services" application.



3\. Seed the Database with Products



To populate the database with initial product data, run the seeder script:



npm run seed





This will clear the products collection and insert 10 sample products.



4\. Running the Backend Server



To start the backend server, run the following command. The server will run on http://localhost:3000.



npm run dev





You should see confirmation messages in your terminal:



Server running on port 3000

MongoDB connected





Frontend Setup



Prerequisites



Node.js (v18 or later recommended)



Expo Go App: Install the Expo Go application on your physical Android or iOS device.



1\. Installation



Navigate to the frontend directory and install the required dependencies:



cd frontend

npm install





2\. Configure Backend Connection



The frontend app needs to know your computer's local IP address to communicate with the backend server.



Find Your IP Address:



On Windows, open Command Prompt and run ipconfig.



On Mac/Linux, open Terminal and run ifconfig.



Look for the "IPv4 Address" (e.g., 192.168.1.100).



Update the Config File: Open the file frontend/constants/config.ts and replace 'YOUR\_CURRENT\_IP' with the IP address you just found.



// Example:

const API\_URL = '\[http://192.168.1.100:3000/api](http://192.168.1.100:3000/api)';





3\. Running the Frontend App



To start the frontend development server, run the following command:



npx expo start





A QR code will appear in the terminal. Scan this QR code using the Expo Go app on your mobile device to open and run the application.



Frontend-Backend Communication



This application follows a standard client-server architecture:



The React Native (Expo) frontend acts as the client. It uses the axios library to send HTTP requests (GET, POST, PUT, DELETE) to the backend API endpoints (e.g., /api/products, /api/users/login).



The Node.js (Express) backend acts as the server. It listens for incoming requests from the frontend, processes them, and interacts with the MongoDB database using mongoose for data operations (fetching, creating, updating, deleting).



Once the database operation is complete, the server sends a JSON response back to the frontend, which then updates its UI to reflect the new data. For example, after a successful login, the server sends a token, which the app saves to navigate the user to the home screen.



Screenshots



(Please replace the placeholders below with your own screenshots of the application running.)



1\. Login Screen

\[Screenshot of the Login Screen]



2\. Signup Screen

\[Screenshot of the Signup Screen]



3\. Home Screen

\[Screenshot of the Home Screen with products]



4\. Product Details Screen

\[Screenshot of the Product Details Screen with reviews]



5\. Cart Screen

\[Screenshot of the Cart Screen with items]



6\. Checkout Screen

\[Screenshot of the Checkout Screen with shipping and payment details]



7\. Order Confirmation Screen

\[Screenshot of the Order Confirmation Screen]



8\. Profile Screen

\[Screenshot of the User Profile Screen]



9\. My Orders Screen

\[Screenshot of the My Orders history screen]

