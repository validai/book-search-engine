import type { Request, Response } from 'express';
import User, { IUser } from '../models/User.js';
import { signToken } from '../services/auth.js';

export const getSingleUser = async (req: Request, res: Response) => {
  const foundUser = await User.findOne({
    $or: [
      { _id: req.user ? (req.user as { _id: string })._id : req.params.id },
      { username: req.params.username }
    ],
  });

  if (!foundUser) {
    return res.status(400).json({ message: 'Cannot find a user with this id!' });
  }

  return res.json(foundUser);
};

export const createUser = async (req: Request, res: Response) => {
  const user: IUser = await User.create(req.body);

  if (!user) {
    return res.status(400).json({ message: 'Something is wrong!' });
  }

  const token = signToken(user.username, user.email, user._id.toString());

  return res.json({ token, user });
};

export const login = async (req: Request, res: Response) => {
  const user: IUser | null = await User.findOne({
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
};

// save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
// user comes from `req.user` created in the auth middleware function
export const saveBook = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: (req.user as { _id: string })._id },
      { $addToSet: { savedBooks: req.body } },
      { new: true, runValidators: true }
    );
    return res.json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

// remove a book from `savedBooks`
export const deleteBook = async (req: Request, res: Response) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: (req.user as { _id: string })._id },
    { $pull: { savedBooks: { bookId: req.params.bookId } } },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "Couldn't find user with this id!" });
  }

  return res.json(updatedUser);
};
