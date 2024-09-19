const jwt = require('jsonwebtoken');
const User = require('../models/user');


const requireAuth = (req, res, next) =>{
    const token = req.cookies.jwt;


    //check jwt exists & is verified
    if(token){
        jwt.verify(token, 'job apply secret', (err, decodedToekn)=>{
            if(err){
                console.log(err.message);
                res.redirect('login');
            }else{
                console.log(decodedToekn);
                next();
            }
        });
    }else{
        res.redirect('/login');
    }
}

//check current user 
const checkUser = (req, res, next) =>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'job apply secret', async (err, decodedToekn)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                console.log(decodedToekn);
                let user = await User.findById(decodedToekn.id);
                res.locals.user = user;
                req.user = decodedToekn;
    
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };