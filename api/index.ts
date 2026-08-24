import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/app';
import { connectDB } from '../server/config/db';

let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('[Vercel DB Connection Error]:', err);
    }
  }
  return app(req, res);
}
