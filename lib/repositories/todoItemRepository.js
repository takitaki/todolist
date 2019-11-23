const models = require('../models.js');

class TodoItemRepository {

  constructor(model) {
    this.model = model;
  }

  // create a new todo
  create(description, parentListId) {
    const newTodo = { description, parentListId, done: false };
    const todo = new this.model(newTodo);
    return todo.save().then((todo) => {
      return this.updateParentCounts(parentListId).then( () => todo ) ;
    });
  }

  // return all todos of parent
  findAllByParentListId(parentListId) {
    return this.model.find(
      { 'parentListId': parentListId },
    );
  }

  //find todo by the id
  findById(id) {
    return this.model.find(id);
  }

  // delete todo
  deleteById(id) {
    return this.model.findByIdAndDelete(id).then( todo => {
      return this.updateParentCounts(todo.parentListId).then( () => todo) ;
    });
  }

  //update todo
  updateById(id, item) {
    const query = { _id: id };
    return this.model.findOneAndUpdate(query, { $set: item  }, { useFindAndModify: false }).then((todo) => {
      return this.updateParentCounts(todo.parentListId).then( () => todo) ;
    });
  }

  updateDescriptionById(id, description) {
    const query = { _id: id };
    return this.model.findOneAndUpdate(query, { $set: { description } }, { useFindAndModify: false });
  }

  updateParentCounts(parentListId) {
    let notDoneCountQuery = this.model.find({
      parentListId,
      done: false
    }).countDocuments();

    let totalCountQuery = this.model.find({
      parentListId
    }).countDocuments();


    return Promise.all([notDoneCountQuery, totalCountQuery]).then(values => {
      const query = { _id: parentListId };
      return models.TodoList.findOneAndUpdate(query,
        { $set: { numberNotdone: values[0], numberItems: values[1] } },
        { useFindAndModify: false });
    })

  }
}

module.exports = new TodoItemRepository(models.TodoListItem);