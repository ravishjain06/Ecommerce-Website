import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectToDatabase } from './utils/DatabaseConnection.js';
import { errorMiddleware } from './middleware/error_middleware.js';
import { corsOptions } from './utils/cors.js';
import { handleStripeWebhook } from './controllers/order_controller.js';

import userRoutes from './routes/user_routes.js';
import productRoutes from './routes/product_routes.js';
import cartRoutes from './routes/cart_routes.js';
import orderRoutes from './routes/order_routes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
console.log("✅ Express app initialized");

// 1️⃣ Stripe Webhook - Must be BEFORE express.json()
app.post(
  '/webhook/stripe',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

// 2️⃣ Middleware: CORS, Cookies, Body Parsers
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3️⃣ API Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/admin', adminRoutes);

// 4️⃣ Root Route for Testing
app.get('/', (req, res) => {
  res.send('✅ Server is up and running!');
});

// 5️⃣ Global Error Middleware
app.use(errorMiddleware);

// 6️⃣ Start Server After DB Connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
