import User from '../models/User.js';
import { AuthenticationError } from '@apollo/server';
import { signToken } from '../services/auth.js';

interface LoginArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
  email: string;
  password: string;
}

interface SaveBookArgs {
  input: {
    bookId: string;
    authors?: string[];
    description?: string;
    title: string;
    image?: string;
    link?: string;
  };
}

interface RemoveBookArgs {
  bookId: string;
}

interface Context {
  user?: { id: string };
}

const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (context.user) {
        return User.findById(context.user.id);
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    login: async (_: unknown, { email, password }: LoginArgs) => {
      const user = await User.findOne({ email });

      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (_: unknown, { username, email, password }: UserArgs) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (_: unknown, { input }: SaveBookArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      return User.findByIdAndUpdate(
        context.user.id,
        { $addToSet: { savedBooks: input } },
        { new: true, runValidators: true }
      );
    },

    removeBook: async (_: unknown, { bookId }: RemoveBookArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      return User.findByIdAndUpdate(
        context.user.id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

export default resolvers;
