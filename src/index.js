
const express = require('express')   
const app = express()
// const hbs = require('hbs')  
const port = 3000
const path = require('path');
const tempelatePath = path.join(__dirname, '../tempelates')
const collection= require("./mongodb")
const passport = require('passport');
const session = require('express-session'); 
// require('../passport');
require('dotenv').config(); 
require('./passport')
const homeRoutes = require('./home');
const campaign1 = require('./campaign')
const messageRouter = require('./message');
const sendmessageRouter = require('./send_message')
const exphbs = require('express-handlebars');
const bcrypt = require('bcrypt');
const customer = require('./customer');


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
  res.clearCookie('connect.sid'); 
  res.redirect('/login'); 
})


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error logging out");
    }
    res.clearCookie('connect.sid'); 
    res.redirect('/login'); 
  });
});

app.get('/signup', (req, res) => {
  res.render("signup");
});


app.get('/login', (req, res) => {
  // res.render("login");
  res.render('login', { googleAuthUrl: '/auth/google' });
});


app.post('/signup',async (req, res) => {


  const { email, password, fname, lname } = req.body;



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

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);


  const data = {
    email,
    password: hashedPassword,
    fname,
    lname
  }

  const userExists = await collection.findOne({ email }); // Check for email

  if (userExists) {
    return res.status(409).send("User already exists");
  }
  await collection.insertMany([data])

  req.session.userEmail = email;

  // res.status(200).send("Successfull signup");
  res.render("home")

})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const requiredFields = ['email', 'password'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
    return res.status(400).send(errorMessage);
  }

  try {

    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(401).send("Incorrect email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.userEmail = email;
      return res.render("home");
    } else {
      return res.status(401).send("Incorrect email or password");
    }
  } catch (error) {
    console.error(error); 
    return res.status(500).send("Internal server error");
  }
});



  app.use((req, res, next) => {
    req.currentUserEmail = req.session.userEmail || null;
    next();
  });

app.use('/', homeRoutes)

app.use('/', campaign1);

app.use('/', messageRouter);

app.use('/', sendmessageRouter);
  

// app.use('/', insertCustomerouter);

app.post('/customers', async (req, res) => {
  try {
    const newCustomer = new customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
