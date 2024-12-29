import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import connect from "./config/dbConnection.js";
connect();

const port = process.env.PORT || 8080;

//middleware
app.use(express.json());
app.use(cors());

//routes
import authRouter from "./routes/authRoute.js";
app.use('/api/v1/auth', authRouter);
import userRouter from "./routes/userRoute.js";
app.use('/api/v1/user', userRouter);
import jobsRouter from "./routes/jobsRoute.js";
app.use('/api/v1/jobs', jobsRouter);

app.get('/', (req, res) => {
    res.send("<h1>Welcome to my JOB PORTAL</h1>")
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})