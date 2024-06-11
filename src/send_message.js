const express = require('express');
const router = express.Router();
const app = express()
const hbs = require('hbs')  
const port = 3000
const path = require('path');
const tempelatePath = path.join(__dirname, '../tempelates')
require('dotenv').config(); 


app.use(express.json());
app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));


router.get('/sendmessage', async (req, res) => {
    res.render("message")
  });


module.exports = router;