import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
export default mongoose.connection;
