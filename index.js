const express = require('express');
const app= express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userRoutes = require('./routes/user');



mongoose.set('strictQuery',true);
// jab hum mongoose ka use krte hai toh strictQuery ki warnings aati hai...toh uske liye strictQuery ko set krenge true
mongoose.connect('mongodb://127.0.0.1:27017/JWT-DEMO')
.then(()=>{
    console.log("DB connected")
})
.catch((err)=>{
    console.log(err)
})

// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// urlencoded ka use krte hai for form data
app.use(express.json());// iska uske krte hai for json data ( for parsing json)
// json ki form  m data milega
app.get('/',(req,res)=>{
    res.send("its a root route");
})

// signup
app.use(userRoutes);



app.listen(8080,()=>{
    console.log('server connected at port 8080')
})
