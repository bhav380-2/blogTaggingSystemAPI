const {body,validationResult} = require('express-validator')

const userValidateRequest = async (req,res,next)=>{

    //1. setup rules for validation

    const rules = [

        body('name').isLength({min:3}).withMessage('name should have atleast 3 characters'),
        body('name').isAlpha().withMessage('name can only have english alplhabets (a-z) (A-Z)'),
        body('password').isLength({min:8}).withMessage('password should have atleast 8 characters'),
        body('email').isEmail().withMessage('invalid email')
    ]

    //2. run those rule.
    await Promise.all(rules.map(rule=>rule.run(req)));

    //3. check if there are any errors after running the rules

    let validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        
        return res.status(400).send({
            "success":false,
            "error":{
                "message":validationErrors.array()[0].msg
            }
        })
    }

    next();
}

module.exports = userValidateRequest;