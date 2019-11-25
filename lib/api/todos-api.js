const express = require('express')
const router = express.Router()

const todoListRepository = require('../repositories/todoListRepository');
const todoItemRepository = require('../repositories/todoItemRepository');
var cacheMiddleware = require('../middlewares/cache-middleware');


class TodosApi {

    start(app, cache) {
        const cacheMw = cacheMiddleware(cache);
        router.get('/:listId', cacheMw, (req, res, next) => {
            const listId = req.params.listId;
            todoListRepository.findById(listId).then(todoList => {
                res.json(todoList);
            }).catch((error) => { console.log(error); return next(error); });
        });

        router.post('/:listId/items', (req, res, next) => {
            cacheHandler.clear();// invalidate cache
            todoItemRepository.create(req.body.description, req.params.listId).then((todo) => {
                res.json(todo);
            }).catch((error) => { console.log(error); return next(error); });
        });

        router.get('/:listId/items', cacheMw, (req, res, next) => {
            const listId = req.params.listId;
            todoItemRepository.findAllByParentListId(listId).then(items => {
                res.json(items);
            }).catch((error) => { console.log(error); return next(error); });
        });

        router.put('/:listId/items/:itemId', (req, res, next) => {
            cache.clear();; // invalidate cache
            todoItemRepository.updateById(req.params.itemId, req.body).then((todo) => {
                console.log("updated:", todo);
                res.json(todo);
            }).catch((error) => { console.log(error); return next(error); });
        });

        router.delete('/:listId/items/:itemId', (req, res, next) => {
            cache.clear();; // invalidate cache
            todoItemRepository.deleteById(req.params.itemId).then((deleted) => {
                res.json(deleted);
            }).catch((error) => { console.log(error); return next(error); });
        });

        app.use('/todos', router);
    }
}
module.exports = new TodosApi();