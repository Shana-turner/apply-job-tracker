require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require ('cookie-parser');
const {requireAuth, checkUser} = require('./middleware/authMiddleware');
const path = require('path');

const app = express();

//middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//database connection
const db = 'mongodb+srv://shanaBiot:Zno8V9dgczXjVQAc@cluster0.scfypel.mongodb.net/job-apply';
mongoose.connect(db)
    .then((result) => app.listen(3000, () =>{
        console.log(`You're listening to port 3000`)
    }))
    .catch((err)=> console.log(err));


//routes
app.get('*', checkUser);

app.get('/', (req, res)=> res.render('home'));
app.get('/profil', requireAuth, (req, res) => res.render('profil'));
app.get('/createJob', requireAuth, (req, res)=> res.render('createJob') );
app.use(authRoutes);




