






/** Grab the user from the MongoDB */
function grabUser(username) {
  var Users = global.DB.get('users')
  return Users.find({username: username}, {_id:-1})
}









module.exports = {
  grabUser: grabUser
}