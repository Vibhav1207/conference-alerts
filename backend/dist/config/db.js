"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongoMemoryServer = null;
const connectDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/conference_alerts';
    try {
        // Attempt connecting to specified MongoDB URI with a short timeout
        await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 3000,
        });
        console.log(`[Database] Successfully connected to MongoDB at ${uri}`);
    }
    catch (error) {
        console.warn(`[Database] Failed to connect to standard MongoDB at ${uri}. Starting MongoMemoryServer...`);
        try {
            mongoMemoryServer = await mongodb_memory_server_1.MongoMemoryServer.create();
            const memUri = mongoMemoryServer.getUri();
            await mongoose_1.default.connect(memUri);
            console.log(`[Database] Successfully connected to In-Memory MongoDB at ${memUri}`);
        }
        catch (memErr) {
            console.error('[Database] Critical error connecting to MongoDB:', memErr);
            process.exit(1);
        }
    }
};
exports.connectDB = connectDB;
const closeDB = async () => {
    await mongoose_1.default.connection.close();
    if (mongoMemoryServer) {
        await mongoMemoryServer.stop();
    }
};
exports.closeDB = closeDB;
