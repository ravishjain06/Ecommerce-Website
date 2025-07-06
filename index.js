import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import { connectToDatabase } from './utils/DatabaseConnection.js';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/error_middleware.js';
import cors from 'cors';
import userRoutes from './routes/user_routes.js'
import productRoutes from './routes/product_routes.js'
import cartRoutes from './routes/cart_routes.js'
import orderRoutes from './routes/order_routes.js'
import adminRoutes from './routes/adminRoutes.js'

import { corsOptions } from './utils/cors.js';
import { handleStripeWebhook } from './controllers/order_controller.js';

dotenv.config();

const app = express();

// 1. Register webhook route FIRST, before any body parsers!
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), (req, res, next) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    console.log('🎯 Webhook endpoint hit!');
    console.log('🔗 Webhook called at:', fullUrl);
    next();
}, handleStripeWebhook);

// 2. Now register body parsers and other middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(errorMiddleware)

const PORT = process.env.PORT || 5000;

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/product',productRoutes)
app.use('/api/v1/cart',cartRoutes)
app.use('/api/v1/order',orderRoutes)
app.use('/api/v1/admin',adminRoutes)




await connectToDatabase();
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    const webhookBase = process.env.CLIENT_URL || `http://localhost:${PORT}`;
    console.log(`📡 Webhook endpoint: ${webhookBase}/webhook/stripe`);
});

console.log('🔧 Environment variables:');
console.log('- PORT:', process.env.PORT || 4242);
console.log('- STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing');
console.log('- STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing');
console.log('- CLIENT_URL:', process.env.CLIENT_URL || 'http://localhost:5173');


// stripe listen --forward-to localhost:3001/webhook/stripe
// import {randomBytes} from 'crypto';
// console.log(randomBytes(64).toString('hex')); // Generates a random string for use in secure applications
