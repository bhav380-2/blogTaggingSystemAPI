const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const Users = require("../models/User");

module.exports = class UserController {

    async signin(req, res) {

        try{
            const {email,password} = req.body;
            const user = await Users.findOne({email:email})

            if(!user){
                return res.status(401).send({
                    "status": false,
                    "error": {
                        "message":"Invalid email/password"
                    }
                  });
            }else{

                const result = bcrypt.compare(password,user.password);

                if(result){
                    const token = jwt.sign({userID:user.id,email:user.email},"S8VwinaPGDP0FwQ2gKidx75GH0ZTV15m",{
                        expiresIn:'1h'
                    });

                    return res.status(200).send({
                        "status":true,
                        "content":{
                            "data" : {
                                "id": user.id,
                                "name": user.name,
                                "email": user.email,
                                "created_at": user.createdAt
                            },
                            "meta":{
                                "access_token": token
                            }
                        }
                    })
                }else{
                    
                    return res.status(401).send({
                        "status": false,
                        "error": {
                            "message":"Invalid email/password"
                        }
                      });
                }
            }

        }catch(err){
            console.log("error in signin ::::",err);
            return res.status(500).send("Something went wrong")
        }

    }

    async signup(req, res) {

        try {

            const { name, email, password } = req.body;
            const existingUser = await Users.findOne({email : email});

            if(existingUser){
                return res.status(400).send({
                    "status": false,
                    "message":"User with this email address already exists"
                })
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = await Users.create({
                name:name,
                email:email,
                password:hashedPassword
            })
            // console.log(newUser.id+"***************************");

            const token = jwt.sign({ userID: newUser.id, email: newUser.email },"S8VwinaPGDP0FwQ2gKidx75GH0ZTV15m" , {
                expiresIn: '1h',
            });

            return res.status(201).send({
                "status": true,
                "content": {
                    "data": {

                        "id": newUser.id,
                        "name": newUser.name,
                        "email": newUser.email,
                        "created_at": newUser.createdAt
                    },
                    "meta": {
                        "access_token": token
                    }
                }
            })

        } catch (err) {
            console.log("error in signup :::", err);
            return res.status(500).send("Something went wrong");
        }
    }
}