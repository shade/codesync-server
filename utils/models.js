var mongoose = require('mongoose');

// Create a schema for users.
var UserSchema = mongoose.Schema({
  username: String,
  password: String,
  verified: Boolean,
  personal: {
    name: String,
    email: String
  }
})

// Create the model from the user schema.
var User = mongoose.model('User', UserSchema)

// Create a schema for repos.
var RepoSchema = mongoose.Schema({
  _id: String,
  reponame: String,
  users: [String]
})

// Create the model from the repo schema.
var Repo = mongoose.model('Repo', RepoSchema)



module.exports = {
  User: User,
  Repo: Repo
}