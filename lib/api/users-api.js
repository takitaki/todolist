const express = require('express')
const router = express.Router()
const userProfileRepository = require('../repositories/userProfileRepository');
const todoListRepository = require('../repositories/todoListRepository');
var cacheMiddleware = require('../middlewares/cache-middleware');

class UserApi {

    start(cache) {
        console.log("Starting users api");
        const cacheMw = cacheMiddleware(cache);

        router.post('/', (req, res, next) => {
            cache.clear(); // invalidate cache
            const { username } = req.body;
            userProfileRepository.create(username).then((user) => {
                res.json(user);
            }).catch((error) => { console.log(error); return next(error); });
        });

        router.get('/:id', cacheMw, (req, res, next) => {
            userProfileRepository.findById(req.params.id).then((user) => {
                res.json(user);
            }).catch((error) => { console.log(error); return next(error); });
        });

        router.get('/', cacheMw, (req, res, next) => {
            userProfileRepository.findAll().then((users) => {
                res.json(users);
            }).catch((error) => { console.log(error); return next(error); });
        });

        router.post('/:id/todos', (req, res, next) => {
            cache.clear();// invalidate cache
            todoListRepository.create(req.params.id, req.body).then((todoList) => {
                console.log("Got todoList created:", todoList);
                res.json(todoList);
                res.send();
            }).catch((error) => { console.log(error); return next(error); });
        });

        router.put('/:id/todos/:listId', (req, res, next) => {
            cache.clear();; // invalidate cache
            todoListRepository.updateById(req.params.listId, req.body).then((todoList) => {
                res.json(todoList);
                res.send();
            }).catch((error) => { console.log(error); return next(error); });
        });

        router.get('/:id/todos', cacheMw, (req, res, next) => {
            const userId = req.params.id;
            todoListRepository.findByUserId(userId).then((todoLists) => {
                res.json(todoLists);
            }).catch((error) => { console.log(error); return next(error); });
        });

        return router;
    }
}
module.exports = new UserApi();