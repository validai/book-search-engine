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
exports.deleteBook = exports.saveBook = exports.login = exports.createUser = exports.getSingleUser = void 0;
const User_js_1 = __importDefault(require("../models/User.js"));
const auth_js_1 = require("../services/auth.js");
// Get a single user by either their ID or username
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield User_js_1.default.findOne({
            $or: [
                { _id: req.user ? req.user._id : req.params.id },
                { username: req.params.username }
            ]
        });
        if (!foundUser) {
            return res.status(400).json({ message: 'Cannot find a user with this ID!' });
        }
        return res.json(foundUser);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.getSingleUser = getSingleUser;
// Create a user, sign a token, and send it back
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_js_1.default.create(req.body);
        if (!user) {
            return res.status(400).json({ message: 'Something is wrong!' });
        }
        const token = (0, auth_js_1.signToken)(user.username, user.email, user._id.toString());
        return res.json({ token, user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.createUser = createUser;
// Login a user, sign a token, and send it back
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_js_1.default.findOne({
            $or: [{ username: req.body.username }, { email: req.body.email }]
        });
        if (!user) {
            return res.status(400).json({ message: "Can't find this user" });
        }
        const correctPw = yield user.isCorrectPassword(req.body.password);
        if (!correctPw) {
            return res.status(400).json({ message: 'Wrong password!' });
        }
        const token = (0, auth_js_1.signToken)(user.username, user.email, user._id.toString());
        return res.json({ token, user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.login = login;
// Save a book to a user's savedBooks field
const saveBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield User_js_1.default.findOneAndUpdate({ _id: req.user ? req.user._id : req.body.userId }, { $addToSet: { savedBooks: req.body } }, { new: true, runValidators: true });
        return res.json(updatedUser);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.saveBook = saveBook;
// Remove a book from savedBooks
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield User_js_1.default.findOneAndUpdate({ _id: req.user ? req.user._id : req.body.userId }, { $pull: { savedBooks: { bookId: req.params.bookId } } }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "Couldn't find user with this ID!" });
        }
        return res.json(updatedUser);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteBook = deleteBook;
