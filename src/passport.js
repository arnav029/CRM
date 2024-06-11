const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config(); // Load environment variables from .env file



passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile)
  }

));

passport.serializeUser((user,done)=> {
  done(null,user)
})


passport.deserializeUser((user,done)=> {
  done(null,user)
})