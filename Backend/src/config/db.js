import mongoose from 'mongoose';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const DB = await mongoose.connect(process.env.MONGO_DB_URI, {
      connectTimeoutMS: 10_000,
      serverSelectionTimeoutMS: 10_000,
    });
    console.log(`DB connected: ${DB.connection.name}`);

    return DB;
  } catch (error) {
    console.log('Error ', error.message);
    process.exit(1);
  }
};

export default connectDB;
