const bcrypt = require('bcrypt')
const {User} = require('../models');
const jwt = require('jsonwebtoken');

module.exports = class UserController {

    async signin(req, res) {

        try{
            const {email,password} = req.body;
            const user = await User.findOne({where:{email:email}})

            console.log(user);
            if(!user){
                return res.status(400).send({
                    "status": false,
                    "errors": [
                      {
                        "param": "email",
                        "message": "Please provide a valid email address.",
                        "code": "INVALID_INPUT"
                      }
                    ]
                  });
            }else{

                const result = await bcrypt.compare(password,user.password);

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
                    
                    return res.status(400).send({
                        "status": false,
                        "errors": [
                          {
                            "param": "password",
                            "message": "The credentials you provided are invalid.",
                            "code": "INVALID_CREDENTIALS"
                          }
                        ]
                      });
                }
            }

        }catch(err){
            console.log("error in signin ::::",err);
            return res.status(500).send("Something went wrong")
        }


    }

    async signup(req, res) {

     
        // let errors = [];

        // if (name.length < 2) {

        //     errors.push({
        //         "param": "name",
        //         "message": "Name should be at least 2 characters.",
        //         "code": "INVALID_INPUT"
        //     })
        // }

        // if (password.length < 6) {
        //     errors.push({
        //         "param": "password",
        //         "message": "Password should be at least 6 characters.",
        //         "code": "INVALID_INPUT"
        //     })
        // }

        // if (errors.length > 0) {
        //     return res.status(400).send({
        //         "status": false,
        //         "errors": errors
        //     })
        // }

        try {

            const { name, email, password } = req.body;
            const existingUser = await User.findOne({where:{email:email}})

            if(existingUser){
                return res.status(400).send({
                    "status": false,
                    "message":"User with this email address already exists"
                })

            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = await User.create({
                name:name,
                email:email,
                password:hashedPassword
            })

            const token = jwt.sign({ userID: newUser.id, email: newUser.email },"S8VwinaPGDP0FwQ2gKidx75GH0ZTV15m" , {
                expiresIn: '1h',
            });

            return res.status(200).send({
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