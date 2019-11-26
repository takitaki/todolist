const expect = require('chai').expect;
const sinon = require('sinon');
const usersRepository = require('../../lib/repositories/userProfileRepository');
const UserModel = require('../../lib/models.js').UserProfile;

describe('Testing user', () => {
// Reset call count after each test
afterEach(function() {
  sinon.reset();
});

  it('creates a user', (done) => {
    var saveStub = sinon.stub(UserModel.prototype, 'save');
    usersRepository.create("cool user 1");
    setTimeout(function() {
      expect(saveStub.called).to.equal(true);
      expect(UserModel.prototype.save.callCount).to.equal(1);
      done();
    }, 0);
  });

  it('retrieves a user', () => {
    sinon.stub(UserModel, 'findById');
    let expected = "1234";
    usersRepository.findById(expected);
    sinon.assert.calledWith(UserModel.findById, expected);
  });

  it('retrieves all users', () => {
    sinon.stub(UserModel, 'find');
    usersRepository.findAll();
    sinon.assert.calledOnce(UserModel.find);
  });

});

