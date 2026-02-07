import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// accessing env file
dotenv.config();

// importing routes
import authRoute from './routes/authRoute.js';
import reportsRoute from './routes/reportsRoute.js';
import chatRoute from './routes/chatRoute.js'
import profileRoute from './routes/profileRoute.js';

// default settings
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares to parse json request bodies and cors for handling cross origin requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://report-ease-theta.vercel.app"
    ],
    credentials: true,
  })
);

app.use(cookieParser());

// connecting database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// applying routes
app.use('/auth',authRoute);
app.use('/reports',reportsRoute);
app.use('/chat',chatRoute);
app.use('/profile',profileRoute);


// default first page
app.get('/', (req, res) => {
    res.send("Backend is Alive");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    env: process.env.NODE_ENV
  });
});

//listening the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});