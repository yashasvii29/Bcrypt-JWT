const jwt = require('jsonwebtoken');
const generateAuthToken = function(data){
        data  =  JSON.stringify(data);
        const token =  jwt.sign(data , 'YASHASVIWEBDEV')
        // YASHASVIWEBDEV it is a secret key but hum ise .env file m likenge and access krne ke liye we will write process.env.SECRET_KEY
        return token;
    }
    
module.exports  = generateAuthToken;