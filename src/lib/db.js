import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tnmyweb:tnmyweb@cluster0.lzf50.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
