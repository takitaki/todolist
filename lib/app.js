require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path');
const index = require('./api/index.js');

const cacheProvider = new Map();//the simpliest impl
const userApi = require('./api/users-api.js').start(cacheProvider);
const todoApi = require('./api/todos-api.js').start(cacheProvider);

app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/', index);

// APIs
app.use('/users', userApi);
app.use('/todos', todoApi);

app.use((req, res, next) => {
    console.log("got  not found for URL", req.url);
    res.status(404).send("Sorry can't find that!")
});

module.exports = app;