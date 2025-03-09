"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const apollo_server_express_1 = require("apollo-server-express");
const auth_1 = require("../services/auth");
const resolvers = {
    Query: {
        me: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (context.user) {
                return User_1.default.findById(context.user.id);
            }
            throw new apollo_server_express_1.AuthenticationError('Not logged in');
        }),
    },
    Mutation: {
        login: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { email, password }) {
            const user = yield User_1.default.findOne({ email });
            if (!user || !(yield user.isCorrectPassword(password))) {
                throw new apollo_server_express_1.AuthenticationError('Invalid credentials');
            }
            const token = (0, auth_1.signToken)(user);
            return { token, user };
        }),
        addUser: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { username, email, password }) {
            const user = yield User_1.default.create({ username, email, password });
            const token = (0, auth_1.signToken)(user);
            return { token, user };
        }),
        saveBook: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
            if (!context.user) {
                throw new apollo_server_express_1.AuthenticationError('Not logged in');
            }
            return User_1.default.findByIdAndUpdate(context.user.id, { $addToSet: { savedBooks: input } }, { new: true, runValidators: true });
        }),
        removeBook: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { bookId }, context) {
            if (!context.user) {
                throw new apollo_server_express_1.AuthenticationError('Not logged in');
            }
            return User_1.default.findByIdAndUpdate(context.user.id, { $pull: { savedBooks: { bookId } } }, { new: true });
        }),
    },
};
exports.default = resolvers;
