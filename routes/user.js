
// Declare the packages.
const Async = require('async')

const DB = require('../utils/db')
const Security = require('../utils/security')


// Declare the constants.
// The length of the token. This is: 1 year in ms.
const TOKEN_EXPIRY_TIME = 3.154e10



// This handles all /auth token requests.
var authRoute = (request, reply) => {
  // Grab the necessary params.
  var {username, password, ide_id} = request.payload

  Async.series([
    (cb) => {

      // Get the user, if they don't exist, cast an error
      DB.grabUser(username).then((user) => {
        cb(null, user)
      }, (err) => {
        cb('User not found')
      })
    },
    (cb) => {

      // Compare the password the user sent to the db one.
      Security.compare(password, user.password).then((valid) => {
        if (valid) {
          cb(null, true)
        } else {
          cb('This is a bad password')
        }
      })
    }
  ], (err, res) => {

    // If there was an error send it out. 
    // Else, send a token.
    if (err) {
      reply({
        error: err
      })
    } else {
      reply({
        token: Token.generate(res[0], TOKEN_EXPIRY_TIME),
        expiry: TOKEN_EXPIRY_TIME + Date.now()
      })
    }
  })
}



// This handles all the /signup requests.
var signupRoute = (request, reply) => {
  var {
    username,
    password,
    email
  } = request.payload

}










//////////////////////
// SETUP THE ROUTES //
//////////////////////

var Routes = []

/**
 * `auth` - returns the token based on username and password. Also stores ide.
 */
Routes.push({
  method: 'POST',
  path: '/user/auth',
  handler: authRoute
})

Routes.push({
  method: 'POST',
  path: '/user/signup',
  handler: authRoute
})





module.exports = Routes