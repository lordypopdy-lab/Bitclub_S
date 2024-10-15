const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true 
  }));

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('Database Connected successfuly!'))
.catch((error)=> console.log('Database not connected', error));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
// app.use('/', require('./routes/authRoute'));

const PORT = 8080
app.listen(PORT, ()=>{
  console.log(`App is Running at Port: ${PORT}`);
})
