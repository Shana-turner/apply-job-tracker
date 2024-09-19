const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//config multer storage 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = 'default_folder';
        if (file.mimetype.startsWith('image/')) {
            folder = 'profile_images';
        } else if (file.mimetype === 'application/pdf') {
            folder = 'cvs';
        }
        return {
            folder: folder,
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,  
        };
    },
});

const upload = multer({storage : storage});


//handle errors
const handleErrors = (err) =>{
    console.log(err.message, err.code);
    let errors = {firstname: '', lastname: '', email: '', gitHub : '', password:'', repeatPassword: ''};

    //incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'this email is not registered';
        console.log("email incorrect");
        
    }

     //incorrect password
    if(err.message === 'incorrect password'){
        errors.password = 'this password is not correct ';
        console.log("password incorrect");
        
    }

    //duplicate error code
    if(err.code === 11000){
        errors.email = 'this email is already registered';
        return errors;
    }

    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    
    return errors;
}

//jwt
const maxAge = 3* 24* 60 *60;

const createToken = (id) =>{
    return jwt.sign({ id }, 'job apply secret', {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) =>{

    res.render('signup');
}

module.exports.login_get = (req, res)=>{

    res.render('login');
}



module.exports.signup_post = async (req, res)=>{
    upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'cv', maxCount: 1 }])(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        console.log('req.files:', req.files);

        if (!req.files) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        try {
           const { firstname, lastname, email, gitHub, password, repeatPassword  } = req.body;

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ error: 'No files were uploaded.' });
            }

            //get uploaded files info
            const profileImageUrl = req.files.profileImage[0].path;
            const cvUrl = req.files.cv[0].path;
        
            //create new user
            const user = await User.create({
                firstname, 
                lastname, 
                email, 
                gitHub, 
                password, 
                repeatPassword,
                profileImageUrl,
                cvUrl,
            }); 

            const token = createToken(user._id);
            res.cookie('jwt', token, {httpOnly : true, maxAge: maxAge*1000});
            res.status(201).json({user : user._id});
        } catch (err) {
            const errors = handleErrors(err);
            res.status(400).json({error: err.message});
        } 
    });
    
}

module.exports.login_post = async (req, res)=>{
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly : true, maxAge: maxAge*1000});
        res.status(200).json({user : user._id});
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({});
    }
}




module.exports.logout_get = (req, res)=>{
    res.cookie('jwt', '', {maxAge : 1});
    res.redirect('/');
}