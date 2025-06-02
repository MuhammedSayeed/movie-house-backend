import express from 'express';
import * as dotenv from 'dotenv'
import { dbConnection } from './databases/connection.js';
import { init } from './index.routes.js';
dotenv.config();



const app = express();

const port = process.env.PORT || 3000;

init(app)
dbConnection();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}) 