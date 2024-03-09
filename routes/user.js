const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const User  = require('../models/User');
const generateAuthToken = require('../jwtTokenGenerator');

// signup
router.post('/register',async (req, res) => {
    let user = req.body;
    // console.log(user);
    const Email = await User.findOne({email:user.email}); // only single eamil find krna hai that's why findOne() method ka use kiya hai
    if(Email){
        res.send("email alreay exist");
    }
    else{
        // email exist nhi hai(means account nhi hai) database m toh new user craete krenge
        console.log(user.password);  //hash hone se pehle
        // form ke andar se password ko directly nhi bhej sakte....so bcrypt ki help se password ko hash krna padega so we will use hash() of bcrypt
       user.password = await bcrypt.hash(user.password,10); // password ko hash kr rhe hai using bcrypt
    //    hash method accepts two parameter password and salt(value of salt)
        // jis cheez m time lagta hai wo promise return krta hai and promise ko resolve krne ke liye we will use async and await
        console.log(user.password); // hash hone ke baad
          let dbUser  = new User({
            firstname:user.firstname,
            lastname:user.lastname,
            email:user.email,
            password:user.password
        })
        await dbUser.save(); //new user ko database m save kr rhe hai
        res.send("account has been created");
        // mongosh pr jakar users ke collection m user ke data ko dekh sakte hai
    }
})

router.post('/login',async(req,res)=>{
    let userFormData = req.body;
    console.log(userFormData);
    let userDBInfo;
    try{
         userDBInfo = await User.findOne({email:userFormData.email});
        //  userDBInfo m uss particular user ka data aa jayega jiska email hum User ke database m find kr rhe hai
    }
    catch(err){
        return res.send("login issue");
    }

    if(!userDBInfo){
        return res.send('account has been not created');
    }
    let validatePassword = await bcrypt.compare(userFormData.password,userDBInfo.password);
    // login wale password ko compare kr he hai register wale password se
    // compare will return boolean value
    if(!validatePassword){
        return res.send("Incorrect password");
    }
    // jwt is a npm package so we need to install it
    // password valid hai...so we will create token for authenticity using jwt(json web token)..it is used to generate the token
    // token is like a id card which identify the user(user ki details) means login krne ke baad token generate krnge isse user website ya app ki kisi bhi functionality ko access kr sakta hai use dusri functionality ko use krne ke liye  again and again login krne ki need nhi hai....means 1 page se durse page pr jane ke liye again login krne ki need nhi hai token ki help se user can access all the functionalities of the website or appliucation
    const token = generateAuthToken(userDBInfo); // token ko generate kr rhe hai using jwt
    // generateAuthToken is a function which return token
    console.log(token);
    res.send({
        data:{
            token:token,
            userDBInfo:userDBInfo
        },
        msg:"Everything is fine,user loggedin"
        // logged in user ka(means jis user ne log in kiya hai) uska sara data res m send kr rhe hai 
    })
})
// api(means route) check krne ke liye we will use postman tool 


module.exports = router;