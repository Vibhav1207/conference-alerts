import dotenv from 'dotenv';
import app from '../backend/src/app';
import { connectDB } from '../backend/src/config/db';

dotenv.config();

// Ensure MongoDB is connected before handling serverless request
connectDB().catch((err) => console.error('[Vercel DB Error]', err));

export default app;
