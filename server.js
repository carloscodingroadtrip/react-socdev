var express = require('express');
const mongoose = require('mongoose');

const app = express();

//DB config
const db = require('./config/keys').mongoURI;
//Connect to db

mongoose
    .connect(db)
    .then(() => console.log(`Connected to the database ${db}`))
    .catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Hello World')
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
});