const  jwt = require('jsonwebtoken');

const jwtAuth = (req,res,next)=>{

    // read token
    const token = req.headers['authorization'].replace("Bearer ","");

    // if token not found
    if(!token){
        return res.status(401).send({
            "status": false,
            "error":{
              "message":"You need to sign in to proceed."
            }
        })
    }

    // checks if token is valid
    try{
        const payload = jwt.verify(
            token,
            "S8VwinaPGDP0FwQ2gKidx75GH0ZTV15m"
        );
        req.userId = payload.userID;
        req.userEmail = payload.email;

    }catch(err){
        return res.status(401).send({
            "status": false,
            "error":{
              "message":"You need to sign in to proceed."
            }
            
        })
    }

    // call next middelware
    next();
}

module.exports = jwtAuth;