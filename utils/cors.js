import dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.202.190:5173',
  'http://192.168.202.190:3000',
  process.env.CLIENT_URL, 
];

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
