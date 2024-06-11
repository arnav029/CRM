
const express = require('express')   
const app = express()
const hbs = require('hbs')  
const path = require('path');
const router = express.Router()
const tempelatePath = path.join(__dirname, '../tempelates')
require('dotenv').config(); // Load environment variables from .env file
require('./passport')


app.use(express.json());
app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));


router.get('/home', (req,res)=> {
    res.render("home")
})
router.get('/campaign', (req,res)=> {
    // res.send('This is ')
    res.render("campaign")
})


module.exports = router;