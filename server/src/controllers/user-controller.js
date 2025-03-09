import User from '../models/User.js';
import { signToken } from '../services/auth.js';
// Get a single user by either their ID or username
export const getSingleUser = async (req, res) => {
    try {
        const foundUser = await User.findOne({
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
};
// Create a user, sign a token, and send it back
export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        if (!user) {
            return res.status(400).json({ message: 'Something is wrong!' });
        }
        const token = signToken(user.username, user.email, user._id.toString());
        return res.json({ token, user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
// Login a user, sign a token, and send it back
export const login = async (req, res) => {
    try {
        const user = await User.findOne({
            $or: [{ username: req.body.username }, { email: req.body.email }]
        });
        if (!user) {
            return res.status(400).json({ message: "Can't find this user" });
        }
        const correctPw = await user.isCorrectPassword(req.body.password);
        if (!correctPw) {
            return res.status(400).json({ message: 'Wrong password!' });
        }
        const token = signToken(user.username, user.email, user._id.toString());
        return res.json({ token, user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
// Save a book to a user's savedBooks field
export const saveBook = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: req.user ? req.user._id : req.body.userId }, { $addToSet: { savedBooks: req.body } }, { new: true, runValidators: true });
        return res.json(updatedUser);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
// Remove a book from savedBooks
export const deleteBook = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: req.user ? req.user._id : req.body.userId }, { $pull: { savedBooks: { bookId: req.params.bookId } } }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "Couldn't find user with this ID!" });
        }
        return res.json(updatedUser);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
