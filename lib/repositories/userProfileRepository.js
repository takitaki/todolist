const models = require('../models.js');

class UserProfileRepository {

  constructor(model) {
    this.model = model;
  }

  // create a new profile
  create(username) {
    const newUser = { username };
    const user = new this.model(newUser);
    return user.save();
  }

  //find user by the id
  findById(id) {
    return this.model.findById(id, (err, user)  =>{
      if(err) {
        console.error("Failed to find user", err);
        throw err;
      }
      return user;
    });
  }

  findAll(){
    return this.model.find((err, users)  => {
      if(err) {
        console.error("Failed to find users", err);
        throw err;
      }
      return users;
    });
  }
}

module.exports = new UserProfileRepository(models.UserProfile);