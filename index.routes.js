import userRouter from './src/modules/user/router.js';
import favoriteRouter from './src/modules/favorite/router.js';
import cors from "cors"
import { globalErrorMiddleware } from './src/middlewares/globalErrorMiddelware.js';
import { corsOptions } from './src/config/cors.js';
import express from 'express';
import cookieParser from 'cookie-parser';



const base = "/api/v1";

export function init(app) {
    app.use(cors(corsOptions));
    app.use(express.json({ limit: "10mb" }))
    app.use(cookieParser());


    app.get("/", (req, res) => {
        res.send("Hello World!")
    })
    app.use(`${base}/users`, userRouter)
    app.use(`${base}/favorites`, favoriteRouter)
    app.use(globalErrorMiddleware)
}


