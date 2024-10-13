const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/', (req, res)=>{
    return res.status(200).json({
        message: "Server Running Successfully!"
    })
})

app.listen(8000, ()=>console.log(`Server Running at Port 80000`))
