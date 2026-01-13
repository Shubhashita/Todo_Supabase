const dotenv = require('dotenv');
dotenv.config({ path: '.env.local', quiet: true });

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
});

console.log('Starting server...');

const express = require('express');
const cors = require('cors');

console.log('Loading router...');
const router = require('./routes/index');
console.log('Router loaded.');

const app = express();
const PORT = process.env.PORT || 5000;
const ENV = process.env.ENV || 'development';

let allowedOrigins = [];
try {
    const originsStr = process.env.ALLOWED_ORIGINS || '[]';
    if (originsStr.startsWith('[')) {
        allowedOrigins = JSON.parse(originsStr);
    } else {
        allowedOrigins = originsStr.split(',').map(o => o.trim());
    }
} catch (error) {
    allowedOrigins = [];
}

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (ENV === 'development' || !origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS Blocked:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fs = require('fs');
const path = require('path');

app.use((req, res, next) => {
    const start = Date.now();
    const { method, url } = req;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = `[${new Date().toISOString()}] ${method} ${url} ${res.statusCode} ${duration}ms | User: ${req.user?.id || 'unauth'} | Query: ${JSON.stringify(req.query)} | Body: ${JSON.stringify(req.body)}\n`;
        try {
            fs.appendFileSync(path.join(__dirname, 'debug.log'), log);
        } catch (e) {
            console.error('Failed to write to debug.log', e);
        }
    });

    next();
});

// Routes
app.get('/health', (req, res) => {
    return res.json({ message: "Hello from TODO, server is running 🏃‍♀️", env: ENV });
});

app.use('/', router);

console.log('Attempting to listen on port:', PORT);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const gracefulShutdown = (signal) => {
    console.log(`\nReceived ${signal}, shutting down gracefully`);
    process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));