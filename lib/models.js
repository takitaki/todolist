const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserProfileSchema = new Schema({
  username: String,
});

var TodoListSchema = new Schema({
  title: String,
  userId: {
    ref: 'UserProfile',
    type: 'ObjectId'
  },
  creationDate: { type: Date, default: Date.now },
  numberItems: {type: Number, default: 0},
  numberNotdone: {type: Number, default: 0},
});

var TodoListItemSchema = new Schema({
  description: String,
  done: Boolean,
  creationDate: { type: Date, default: Date.now },
  parentListId: {
    ref: 'TodoList',
    type: 'ObjectId'
  }
});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
const TodoList = mongoose.model('TodoList', TodoListSchema);
const TodoListItem = mongoose.model('TodoListItem', TodoListItemSchema);

module.exports = {
  UserProfile,
  TodoList,
  TodoListItem
};