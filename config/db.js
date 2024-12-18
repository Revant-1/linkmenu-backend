import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Shop from '../models/shopModel.js';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Attempting to connect to MongoDB...');
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // List all collections in the database
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Count documents in shops collection
    const shopCount = await Shop.countDocuments();
    console.log('Number of shops in database:', shopCount);

   
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};



export default connectDB;