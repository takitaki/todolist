const models = require('../models.js');
const mongoose = require('mongoose');
/**
 * var TodoListSchema = {
  _id: Schema.Types.ObjectId,
  title: String,
  user: {
    ref: 'UserProfile',
    type: 'ObjectId'
  },
  creationDate: { type: Date, default: Date.now },
  numberItems: {type: Number, default: 0},
  numberNotdone: {type: Number, default: 0},
};
 */
class TodoListRespository {

  constructor(model) {
    this.model = model;
  }

  // create a new todo
  create(userId, list) {
    console.log("create list:", list);
    const newTodoList = { title: list.title, userId: mongoose.Types.ObjectId(userId) };
    const todoList = new this.model(newTodoList);

    return todoList.save();
  }

  // return all todos of a user

  findByUserId(userId) {
    return this.model.find(
      { 'userId': userId },

    );
  }

  //find todo by the id
  findById(id) {
    return this.model.findById(id);
  }

  //update todo, only title 
  updateById(userId, list) {
    console.log("update list:", list);
    const query = { _id: userId };
    return this.model.findOneAndUpdate(query, { $set: { title: list.title } }, {useFindAndModify: false});
  }
}

module.exports = new TodoListRespository(models.TodoList);