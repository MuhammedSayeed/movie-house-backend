import * as dotenv from 'dotenv'
dotenv.config();


const corsOptions = {
    origin: process.env.FRONTEND_DOMAIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};



export{
    corsOptions
}