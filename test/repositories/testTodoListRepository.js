const expect = require('chai').expect;
const sinon = require('sinon');
const todoListRepository = require('../../lib/repositories/todoListRepository');
const TodoList = require('../../lib/models.js').TodoList;

describe('Repository for TodoList', () => {
  const userId = "5dda24c484f3d64c54266b5c";
afterEach(function() {
});

  it('creates a list', (done) => {
    var saveStub = sinon.stub(TodoList.prototype, 'save');
    todoListRepository.create(userId, "Shopping List");
    setTimeout(function() {
      expect(saveStub.called).to.equal(true);
      expect(TodoList.prototype.save.callCount).to.equal(1);
      done();
    }, 0);
  });

  it('retrieves a list by user id', () => {
    sinon.stub(TodoList, 'find');
    let expected = userId;
    todoListRepository.findByUserId(expected);
    sinon.assert.calledWith(TodoList.find, { 'userId': expected});
  });

  it('retrieves a list by id', () => {
    sinon.stub(TodoList, 'findById');
    let expected = "778";
    todoListRepository.findById(expected);
    sinon.assert.calledWith(TodoList.findById, expected);
  });

});

