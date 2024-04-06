const {body,validationResult} = require('express-validator')

const userValidateRequest = async (req,res,next)=>{

    // setup rules for validation

    const rules = [
        body('name').isLength({min:3}).withMessage('name should have atleast 3 characters').trim().escape(),
        body('password').isLength({min:8}).withMessage('password should have atleast 8 characters').trim().escape(),
        body('email').isEmail().withMessage('invalid email').trim().escape().normalizeEmail()
    ]

    // run the rules
    await Promise.all(rules.map(rule=>rule.run(req)));

    // check if there are any errors after running the rules

    let validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        
        return res.status(400).send({
            "success":false,
            "error":{
                "message":validationErrors.array()[0].msg
            }
        })
    }

    // call next middleware
    next();
}

module.exports = userValidateRequest;