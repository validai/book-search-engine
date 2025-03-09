import express, { Application, Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import db from "./config/connection";
import typeDefs from "./schemas/typeDefs";
import resolvers from "./schemas/resolvers";
import { authMiddleware } from "./services/auth";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apollo Server Setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [],
});

// Start Apollo Server and apply middleware
async function startServer() {
    await server.start();
    app.use("/graphql", expressMiddleware(server, {
        context: async ({ req }) => authMiddleware(req),
    }));

    // Serve static files in production
    if (process.env.NODE_ENV === "production") {
        app.use(express.static(path.resolve(__dirname, "../client/build")));
        app.get("*", (_req: Request, res: Response) => {
            res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
        });
    }

    // Connect to DB and start the server
    db.once("open", () => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
        });
    });
}

// Run the server
startServer();
