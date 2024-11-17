const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use((req, res, next) => {
  const allowedOrigin = "https://bitclub-wallet.vercel.app";
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // If required
  res.setHeader('Access-Control-Allow-Methods', 'POST', 'PUT', 'DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('Database Connected successfuly!'))
.catch((error)=> console.log('Database not connected', error));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use('/', require('./routes/authRoute'));

const PORT = 8080
app.listen(PORT, ()=>{
  console.log(`Bitclub New0147 is Running at Port: ${PORT}`);
})
