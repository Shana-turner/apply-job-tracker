const mongoose = require('mongoose');
const { isEmail } = require('validator');
const { isURL } = require('validator');

const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstname :{
        type : String,
        required: [true, 'Please enter a firstname'],
        minLength : [2, "Minimum fistname length is 2 characters"]
    },
    lastname : {
        type : String,
        required: [true, 'Please enter a lastname'],
        minLength : [2, "Minimum lastname length is 2 characters"]
    },
    email : {
        type : String,
        required: [true, 'Please enter an email'],
        unique : true,
        lowercase : true, 
        validate : [isEmail, 'Please enter a valid email']
    },
    gitHub : {
        type : String,
        required: [true, 'Please enter a gitHub link'], 
        validate : [isURL, 'Please entre a valid URL']
    },
    password : {
        type : String,
        required: [true, 'Please enter a password'],
        minLength: [6, "Minimum password length is 6 characters"]
    },
    profileImageUrl : {
        type: String
    }, 
    cvUrl :{
        type: String
    },
});

//fire a function after doc saved to db
userSchema.post('save', function(doc, next){
    console.log('new user was created& saved', doc);
    next();
});

//fire a function before doc saved to db
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//static method to login user 
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User = mongoose.model('User', userSchema);

module.exports = User;