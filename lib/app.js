require('dotenv').config()
const express = require('express')
const app = express()

var path = require('path');
var index = require('./api/index.js');
const userApi = require('./api/users-api.js');
const todoApi= require('./api/todos-api.js');

const cacheProvider = new Map();//the simpliest impl
userApi.start(app, cacheProvider);
todoApi.start(app, cacheProvider);

app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/', index);

app.use((req, res, err) => {
    console.log("got error", err);
    res.message = err.message;
    res.error = err;

    // render the error page
    res.status = err.status || 500;
});

module.exports = app;