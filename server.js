import express from 'express';
import * as dotenv from 'dotenv'
import { dbConnection } from './databases/connection.js';
import cors from "cors"
import { globalErrorMiddleware } from './src/middlewares/globalErrorMiddelware.js';
import userRouter from './src/modules/user/router.js';
import favoriteRouter from './src/modules/favorite/router.js';
import cookieParser from 'cookie-parser';


const corsOptions = {
    origin: process.env.FRONTEND_DOMAIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT' , 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

const base = "/api/v1";
dotenv.config();
const app = express();
app.options("*", cors(corsOptions));
app.use(express.json())
app.use(cookieParser());
app.use(cors(corsOptions));
const port = 3000;

dbConnection();
app.use(`${base}/users`, userRouter)
app.use(`${base}/favorites`, favoriteRouter)
app.use(globalErrorMiddleware)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}) 