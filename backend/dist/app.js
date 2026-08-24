"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const conferenceRoutes_1 = __importDefault(require("./routes/conferenceRoutes"));
const resourceRoutes_1 = __importDefault(require("./routes/resourceRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
// Production CORS Middleware allowing Vercel deployment URLs and localhost
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman, or same-origin Vercel requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) ||
            /\.vercel\.app$/.test(origin) ||
            /localhost/.test(origin)) {
            return callback(null, true);
        }
        return callback(null, true); // Permissive CORS for seamless production deployment
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Nitin Sir Academic Alerts API',
        jwtExpiresIn: 'never',
        environment: process.env.NODE_ENV || 'production',
    });
});
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/conferences', conferenceRoutes_1.default);
app.use('/api/resources', resourceRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// 404 Route handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `API Route ${req.originalUrl} not found`,
    });
});
// Global Error handling middleware
app.use((err, req, res, next) => {
    console.error('[Error]', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});
exports.default = app;
