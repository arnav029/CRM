
const express = require('express')   
const app = express()
// const hbs = require('hbs')  
const port = 3000
const path = require('path');
const tempelatePath = path.join(__dirname, '../tempelates')
const collection= require("./mongodb")
const passport = require('passport');
const session = require('express-session'); // Import express-session
// require('../passport');
require('dotenv').config(); // Load environment variables from .env file
require('./passport')
const homeRoutes = require('./home');
const campaign1 = require('./campaign')
const messageRouter = require('./message');
const sendmessageRouter = require('./send_message')
const exphbs = require('express-handlebars');

app.use(express.json());
app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.CLIENT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));

function isLoggedIn(req, res, next) {
  req.user ? next() : res.status(401)
}

const hbs = exphbs.create({
  helpers: {
    eq: (arg1, arg2, options) => {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    }
  }
});
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  res.render('login')
})

//  Google authentication routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/auth/google/failure' ,

    successRedirect: '/auth/google/success'
  }),

)
app.get('/auth/google/success',async  (req,res)=> {
  // res.send('Registration succesfull')
  // req.session.userEmail = req.user.email;
  req.session.userEmail = req.user.emails[0].value;
  res.render("home")



})



app.get('/auth/google/failure', (req,res)=> {
  res.send('Something went wrong')
})


app.get('/auth/protected',isLoggedIn, (req,res)=> {
  res.send('Hello there')
})


app.use('/auth/logout', (req,res)=> {
  req.session.destroy()
  res.send("Logged out")
})


app.get('/signup', (req, res) => {
  res.render("signup");
});


app.get('/login', (req, res) => {
  // res.render("login");
  res.render('login', { googleAuthUrl: '/auth/google' });
});


app.post('/signup',async (req, res) => {


  const {email, password} = req.body
  const data = {
    email: req.body.email,
    password: req.body.password,
    fname: req.body.fname,
    lname: req.body.lname
  }


  const requiredFields = ['email', 'password', 'fname', 'lname']; // List of required fields

  const missingFields = [];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
    return res.status(400).send(errorMessage); 
  }

  const userExists = await collection.findOne({ email }); // Check for email

  if (userExists) {
    return res.status(409).send("User already exists");
  }
  await collection.insertMany([data])



  // res.status(200).send("Successfull signup");
  res.render("home")

})

app.post('/login',  async (req, res) => {

  const data = {
    email: req.body.email,
    password: req.body.password,
  }

  const requiredFields = ['email', 'password']; 

  const missingFields = [];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
    return res.status(400).send(errorMessage); 
  }

 try{
  const check = await collection.findOne({email:req.body.email}) 

  if(check.password == req.body.password) {
    res.render("home")

  }

  else{
    res.send("Wrong password")
  }
 }

 catch{
  res.send("Wrong details")
 }


  const token = "dummy-token"
  res.status(200).json({message: "Login successfull", token});


  })


  app.use((req, res, next) => {
    // Get the authenticated user's email from the session
    req.currentUserEmail = req.session.userEmail || null;
    next();
  });

app.use('/', homeRoutes)

app.use('/', campaign1);

app.use('/', messageRouter);

app.use('/', sendmessageRouter);
  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
