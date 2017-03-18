const Security = require('../../utils/security')
var Routes = []



Routes.push({
  method: 'GET',
  path: '/user/find',
  handler: (request, reply) => {
    // Fail if bad token.
    if (!Security.verify(request, reply)) return

    // Grab the appropriate parameters.
    var user = request.query.user

    // Report error, if undefined.
    if (!user) {
      reply({
        error: 'Did not specify user parameter'
      })

      return
    }

    // Create a regex.
    var userRegExp = new RegExp(user + '.*')
    Models.User.find({
      username: userRegExp 
    }, {password: 0}, (err, response) => {

      // Check for DB errors.
      if (err) {
        reply({
          error: 'There was a database error :('
        })
        return
      }

      // Send back a list of users.
      reply({
        users: response
      })
    })
  }
})


module.exports = Routes