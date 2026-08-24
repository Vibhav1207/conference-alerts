import express from 'express';
import dotenv from 'dotenv';
import app from '../server/app';
import { connectDB } from '../server/config/db';

dotenv.config();

// Connect MongoDB for serverless execution
connectDB().catch((err) => console.error('[Vercel DB Error]', err));

export default app;
