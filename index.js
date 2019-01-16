var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/autho_demo');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'aman is student',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

//responsible for reading the session,taking the data from session
passport.use(new LocalStrategy(User.authenticate()));

//this will point to schema in user file and authenticate it
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==========routes=============================
app.get('/', (req, res)=> {
  res.render('home');
});

app.get('/secrets', isLoggedIn, (req, res)=> {
  res.render('secrets');
});

//AUTH ROUTES
app.get('/register', (req, res)=> {
  res.render('register');
});

app.post('/register', (req, res)=> {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user)=> {
    if (err) {
      console.log(err);
      return res.render('register');
    }

    passport.authenticate('local')(req, res, ()=> {
      res.redirect('/secrets');
    });
  });
});

//login form
app.get('/login', (req, res)=> {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secrets',
  failureRedirect: '/login',
}), (req, res)=> {

});

app.get('/logout', (req, res)=> {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

app.listen(3000, ()=> {
  console.log(`Server has stated at 3000`);
});
