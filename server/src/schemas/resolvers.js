import User from '../models/User';
import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../services/auth';
const resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            if (context.user) {
                return User.findById(context.user.id);
            }
            throw new AuthenticationError('Not logged in');
        },
    },
    Mutation: {
        login: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user || !(await user.isCorrectPassword(password))) {
                throw new AuthenticationError('Invalid credentials');
            }
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (_parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (_parent, { input }, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not logged in');
            }
            return User.findByIdAndUpdate(context.user.id, { $addToSet: { savedBooks: input } }, { new: true, runValidators: true });
        },
        removeBook: async (_parent, { bookId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not logged in');
            }
            return User.findByIdAndUpdate(context.user.id, { $pull: { savedBooks: { bookId } } }, { new: true });
        },
    },
};
export default resolvers;
