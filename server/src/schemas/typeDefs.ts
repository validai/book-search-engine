import { gql } from '@apollo/server';

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Auth {
    token: String!
    user: User!
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: String!): User
  }

  input BookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }
`;

export default typeDefs;
