import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import db from './config/connection';
import typeDefs from './schemas/typeDefs';
import resolvers from './schemas/resolvers';
import { authMiddleware } from './services/auth';

dotenv.config();

const app: Application = express(); // Ensure app is correctly typed
const PORT = process.env.PORT || 3001;

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware({ req }),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startServer();
