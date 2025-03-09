"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const context_1 = require("@apollo/client/link/context");
// Create HTTP link to GraphQL API
const httpLink = (0, client_1.createHttpLink)({
    uri: "http://localhost:3001/graphql",
});
// Middleware to include auth token
const authLink = (0, context_1.setContext)((_, { headers }) => {
    const token = localStorage.getItem("id_token");
    return {
        headers: Object.assign(Object.assign({}, headers), { authorization: token ? `Bearer ${token}` : "" }),
    };
});
// Create Apollo Client
const client = new client_1.ApolloClient({
    link: authLink.concat(httpLink),
    cache: new client_1.InMemoryCache(),
});
exports.default = client;
