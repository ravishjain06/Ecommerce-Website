import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/DatabaseConnection.js';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/error_middleware.js';
import cors from 'cors';
import userRoutes from './routes/user_routes.js';
import productRoutes from './routes/product_routes.js';
import cartRoutes from './routes/cart_routes.js';
import orderRoutes from './routes/order_routes.js';
import adminRoutes from './routes/adminRoutes.js';
import { corsOptions } from './utils/cors.js';
import { handleStripeWebhook } from './controllers/order_controller.js';

dotenv.config();

const app = express();


// ---------------------------
// 1️⃣ Stripe Webhook Raw Parser (MUST BE BEFORE json middleware)
// ---------------------------
app.use('/webhook/stripe', (req, res, next) => {
    if (req.originalUrl === '/webhook/stripe') {
        let data = '';
        req.setEncoding('utf8');
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            req.body = Buffer.from(data, 'utf8');
            next();
        });
    } else {
        next();
    }
});

app.post('/webhook/stripe', handleStripeWebhook);


// ---------------------------
// 2️⃣ CORS, Parsers, etc. (AFTER webhook)
// ---------------------------
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ---------------------------
// 3️⃣ API Routes
// ---------------------------
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/admin', adminRoutes);


// ---------------------------
// 4️⃣ Error Middleware
// ---------------------------
app.use(errorMiddleware);


// ---------------------------
// 5️⃣ Database Connection + Start Server
// ---------------------------
const PORT = process.env.PORT || 5000;

await connectToDatabase();

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Webhook endpoint: ${process.env.BACKEND_URL}/webhook/stripe`);
    console.log('✅ Render is now serving your app.');
    console.log('🔑 Stripe keys:');
    console.log('- STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing');
    console.log('- STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing');
    console.log('- CLIENT_URL:', process.env.CLIENT_URL);
    console.log('- BACKEND_URL:', process.env.BACKEND_URL);
});
