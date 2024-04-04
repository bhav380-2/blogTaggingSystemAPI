const {body,validationResult} = require('express-validator')


const blogValidateRequest = async (req,res,next)=>{

    //1. setup rules for validation

    const rules = [

        body('title').notEmpty().withMessage("Title is required"),
        body('content').notEmpty().withMessage('Content is required')
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

module.exports = blogValidateRequest;