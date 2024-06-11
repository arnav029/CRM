const express = require('express');
const router = express.Router();
const app = express()
const hbs = require('hbs')  
const port = 3000
const path = require('path');
const tempelatePath = path.join(__dirname, '../tempelates')


// require('../passport');
require('dotenv').config(); // Load environment variables from .env file


app.use(express.json());
app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));


router.get('/sendmessage', async (req, res) => {
    res.render("message")
  });
// Helper function to send the message to a customer


module.exports = router;