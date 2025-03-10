# Book Search Engine

## Description
The Book Search Engine is a **MERN-stack application** that allows users to search for books and save their favorite titles. Originally built with a **RESTful API**, it has been refactored to utilize **GraphQL with Apollo Server**.

## Features
- **Search for books** using the Google Books API
- **Save books** to a user profile
- **JWT authentication** for user accounts
- **GraphQL API** for optimized data fetching
- **Apollo Client & Server** for smooth front-end and back-end communication

## Technologies Used
- **Front-end:** React, Vite, Apollo Client
- **Back-end:** Node.js, Express, Apollo Server, GraphQL
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT & Bcrypt
- **Deployment:** Render & MongoDB Atlas

## Screenshot
![Book Search Engine Preview](<>)

## Live Deployment
 [Deployed App](<>)

## Installation
1. Clone the repository:
   git clone <repository-url>
   cd book-search-engine
2. Set up environment variables in a .env file:
   MONGO_URI=<your-mongo-db-uri>
   JWT_SECRET=<your-jwt-secret>
   PORT=3001
3. Start the development sever:
   npm run dev

## Deployment Instructions
1. Push the latest code to GitHub.
2. Deploy the backend to Render.
3. Deploy the frontend to Render/Vercel.
4. Connect the backend to MongoDB Atlas.

## License 
This search-engine is licensed under the MIT License.
