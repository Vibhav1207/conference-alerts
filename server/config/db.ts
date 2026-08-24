import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import path from 'path';
import { autoSeedIfEmpty } from '../seed/seedHelper';

// Ensure .env is loaded from root or current dir
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/conferencealerts';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] Successfully connected to MongoDB database 'conferencealerts'!`);
    await autoSeedIfEmpty();
  } catch (error: any) {
    console.warn(`[Database] Connection error (${error.message}).`);
    
    // Serverless / Vercel environments do not support running MongoMemoryServer binary
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      console.error('[Database] Production/Vercel environment: Failed to connect to MONGODB_URI. Please verify MONGODB_URI credentials in Vercel Dashboard Environment Variables.');
      throw error;
    }

    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to In-Memory MongoDB at ${memUri}`);
      await autoSeedIfEmpty();
    } catch (memErr) {
      console.error('[Database] Critical error connecting to MongoDB:', memErr);
      throw memErr;
    }
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.connection.close();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
