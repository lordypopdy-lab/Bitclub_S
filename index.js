const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));

app.get('/', (req, res)=>{
    return res.json({
        message: "Server Is Running Successfully!"
    })
})

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('Database Connected successfuly!'))
.catch((error)=> console.log('Database not connected', error));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
// app.use('/api/', require('./routes/authRoute'));

const port = 8000;
app.listen(port, ()=> console.log(`Server is running at port ${port}`));

module.exports = app
