import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import { connectToDatabase } from './utils/DatabaseConnection.js';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/error_middleware.js';
import cors from 'cors';
import userRoutes from './routes/user_routes.js'
import { corsOptions } from './utils/cors.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser())
app.use(urlencoded({ extended: true }))
app.use(express.json())
app.use(errorMiddleware)
app.use(cors(corsOptions))

app.use('/api/v1/user', userRoutes)


await connectToDatabase();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
