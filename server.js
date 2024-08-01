const dotenv = require('dotenv');

dotenv.config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// CONTROLLERS
const authController = require('./controllers/auth.js');
const calanderCtrl = require('./controllers/calender.js');
const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.DATABASE_URL);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.post('/users/:userId/year', async (req, res) => {
  const year = req.query.year || 2024;
    const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
    const founduser = User.findById(req.session.user._id);
    const E = founduser.events;
    console.log(E);
    res.render('calendar/year.ejs', 
        {calendar: calendar(year),
        months,
        year,
        E,})
});
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);

// LINK TO PUBLIC DIRECTORY
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/year`);
  } else {
    res.render('index.ejs');
  }
});

app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/', calanderCtrl);





app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});



