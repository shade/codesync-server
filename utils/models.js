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

// Create a schema for repoUsers
var RepoUser = mongoose.model('RepoUser', mongoose.Schema({
  username: String,
  level: String
}))

// Create a schema for repos.
var SpaceSchema = mongoose.Schema({
  name: String,
  creator: String,
  users: [RepoUser],
  created: Number
})

// Create the model from the repo schema.
var Space = mongoose.model('Space', SpaceSchema)



module.exports = {
  User: User,
  Space: Space
}