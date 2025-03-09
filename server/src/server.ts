import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import * as path from "path";
import db from "../config/connection";
import typeDefs from "../schemas/typeDefs";
import resolvers from "../schemas/resolvers";
import { authMiddleware } from "../services/auth";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Debugging Statements
console.log("Current __dirname:", __dirname);
console.log("Resolved Path:", path.resolve());
console.log("Environment Variables:", process.env);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../client/dist")));
}

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware(req),
  introspection: true,
  playground: true,
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startServer();