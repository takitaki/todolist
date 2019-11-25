const express = require('express')
const app = express()
const createError = require('http-errors');
const userProfileRepository = require('./repositories/userProfileRepository');
const todoListRepository = require('./repositories/todoListRepository');
const todoItemRepository = require('./repositories/todoItemRepository');
const config = require("./config/appConfig.js");
const mongoose = require('mongoose');
var cacheMiddleware = require('./middlewares/cache-middleware');
var path = require('path');
require('dotenv').config()

var cache = new Map();

mongoose.connect(config.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.render('index', { title: 'Manage ToDo' }))

app.listen(config.PORT, () => console.log(` Listening on port ${config.PORT}!`))

app.post('/users', (req, res) => {
    console.log("got request", req.body);

    cache.clear(); // invalidate cache
    const { username } = req.body;
    userProfileRepository.create(username).then((user) => {
        res.json(user);
        res.send();
    }).catch((error) => console.log(error));
});

app.get('/users/:id', cacheMiddleware(cache), (req, res) => {
    userProfileRepository.findById(req.params.id).then((user) => {
        res.json(user);
    }).catch((error) => console.log(error));
});

app.get('/users', cacheMiddleware(cache), (req, res) => {
    userProfileRepository.findAll().then((users) => {
        res.json(users);
    }).catch((error) => console.log(error));
});

app.post('/users/:id/todos', (req, res) => {
    cache.clear(); ; // invalidate cache
    todoListRepository.create(req.params.id, req.body).then((todoList) => {
        console.log("Got todoList created:", todoList);
        res.json(todoList);
        res.send();
    }).catch((error) => console.log(error));
});

app.put('/users/:id/todos/:listId', (req, res) => {
    cache.clear(); ; // invalidate cache
    todoListRepository.updateById(req.params.listId, req.body).then((todoList) => {
        res.json(todoList);
        res.send();
    }).catch((error) => console.log(error));
});

app.get('/users/:id/todos', cacheMiddleware(cache), (req, res) => {
    const userId = req.params.id;
    todoListRepository.findByUserId(userId).then((todoLists) => {
        res.json(todoLists);
    }).catch((error) => console.log(error));
});

app.get('/todos/:listId', cacheMiddleware(cache), (req, res) => {
    const listId = req.params.listId;
    todoListRepository.findById(listId).then(todoList => {
        res.json(todoList);
    }).catch((error) => console.log(error));
});

app.post('/todos/:listId/items', (req, res) => {
    cache.clear(); ; // invalidate cache
    todoItemRepository.create(req.body.description, req.params.listId).then((todo) => {
        res.json(todo);
    }).catch((error) => console.log(error));
});

app.get('/todos/:listId/items', cacheMiddleware(cache), (req, res) => {
    const listId = req.params.listId;
    todoItemRepository.findAllByParentListId(listId).then(items => {
        res.json(items);
    }).catch((error) => console.log(error));
});

app.put('/todos/:listId/items/:itemId', (req, res) => {
    cache.clear(); ; // invalidate cache
    todoItemRepository.updateById(req.params.itemId, req.body).then((todo) => {
        console.log("updated:", todo);
        res.json(todo);
    }).catch((error) => console.log(error));
});

app.delete('/todos/:listId/items/:itemId', (req, res) => {
    cache.clear(); ; // invalidate cache
    todoItemRepository.deleteById(req.params.itemId).then((deleted) => {
        res.json(deleted);
    }).catch((error) => console.log(error));
});

app.use((req, res, next) => {
    console.log("not found url:", req.url);
    next(createError(404));
});

app.use((req, res, err) => {
    console.log("got error", err);
    res.message = err.message;
    res.error = err;

    // render the error page
    res.status = err.status || 500;
});