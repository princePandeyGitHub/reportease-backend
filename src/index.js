import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// accessing env file
dotenv.config();

// importing routes
import authRoute from './routes/authRoute.js';

// default settings
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares to parse json request bodies and cors for handling cross origin requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// connecting database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// applying routes
app.use('/auth',authRoute);

// default first page
app.get('/', (req, res) => {
    res.send("Backend is Alive");
});

//listening the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});