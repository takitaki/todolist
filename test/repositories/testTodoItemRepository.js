const expect = require('chai').expect;
const sinon = require('sinon');
const todoItemRepository = require('../../lib/repositories/todoItemRepository');
const TodoListItem = require('../../lib/models.js').TodoListItem;

describe('Repository for TodoListItem', () => {
  const listId = "5dda24c484f3d64c54266b5c";
  var mock = {
    then: function (callback) {
      callback(null, { _id: listId });
    }
  };
  let updateParentCountStub = sinon.stub(todoItemRepository, 'updateParentCounts').returns(mock);
  // Reset after each test
  afterEach(function () {
    sinon.restore();
  });

  it('creates a item', (done) => {
    var mockSave = {
      then: function (callback) {
        callback(null, { parentListId: listId });
      }
    };
    var saveStub = sinon.stub(TodoListItem.prototype, 'save').returns(mockSave);

    todoItemRepository.create("Buy milk", listId);

    setTimeout(function () {
      expect(saveStub.called).to.equal(true);
      expect(TodoListItem.prototype.save.callCount).to.equal(1);
      expect(updateParentCountStub.called);
      done();
    }, 0);
  });

  it('deletes a item', (done) => {
    let mockDelete = {
      then: function () {
        return { parentListId: listId };
      }
    };
    let deleteStub = sinon.stub(TodoListItem, 'findByIdAndDelete').returns(mockDelete);

    todoItemRepository.deleteById("itemId");

    setTimeout(function () {
      expect(deleteStub.called).to.equal(true);
      expect(TodoListItem.findByIdAndDelete.callCount).to.equal(1);
      expect(updateParentCountStub.called)
      done();
    }, 0);
  });
});

