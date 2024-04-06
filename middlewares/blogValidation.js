const {body,validationResult} = require('express-validator')

const blogValidateRequest = async (req,res,next)=>{

    // setup rules for validation
    const rules = [
        body('title').notEmpty().withMessage("Title is required").trim().escape(),
        body('content').notEmpty().withMessage('Content is required').trim().escape()
    ]

    // run the rule.
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

    // if no validationErrors , call next middleware
    next();
}

module.exports = blogValidateRequest;