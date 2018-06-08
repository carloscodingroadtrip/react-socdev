const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const gravatar = require('gravatar');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//DB config
const db = require('./config/keys').mongoURI;
//Connect to db
mongoose
    .connect(db)
    .then(() => console.log(`Connected to the database ${db}`))
    .catch(err => console.log(err));

//body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());
//passport config
require('./config/passport')(passport);

//Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
});