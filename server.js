import express from 'express';
import 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js'
import categoryRoute from './routes/categoryRoute.js'
import productRoute from './routes/productRoute.js'
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; /


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rest object
const app = express();
//port
const PORT = process.env.PORT || 10000;


//configure env
dotenv.config();
//database config
connectDB();
//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')))


//routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);
app.use("/api/v1/product", productRoute);

//rest api
app.use('*', function(req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})
//port
//res Listen
app.listen(PORT, () =>{
    console.log(`Server Running on ${process.env.DEV_MODE} & on http://localhost:${PORT}`.bgRed);
})
