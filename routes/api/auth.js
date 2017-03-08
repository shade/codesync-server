
// Declare the packages.
const Async = require('async')
const Validator = require("email-validator");

const DB = require('../../utils/db')
const Security = require('../../utils/security')


// Declare the constants.
// The length of the token. This is: 1 year in ms.
const TOKEN_EXPIRY_TIME = 3.154e10
const API_PREFIX = '/api/v1'


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
  var ul = username.length

  username = username.toLowerCase()
  // Validate the username
  // 
  // Usernames must be alphanumerical, may contain dashes.
  //  Cannot begin or end with one, or contain more than one in a row.
  //  
  // Minimum length: 4
  // Maximum length: 40
  if (username.match(/([^A-Za-z0-9-]|-{2,})/g) || ul > 40 || ul < 4 || username[0] || username[ul-1] == '-') {
    reply({
      error: 'Bad Username'
    })
    return
  }

  // Validate the email.
  if (!Validator.validate(email)) {
    reply({
      error: 'Bad Email'
    })
    return
  }

  // Make sure that both the username
  // and the email aren't registered in the database already.
  DB.find({
    $or:[
      {email: email},
      {username: username}
    ]
  }, (err, result) => {

    // If we found a match, tell em.
    if (result.length != 0) {
      if (result[0].email == email) {
        reply({
          error: 'Email Taken'
        })
      } else {
        reply({
          error: 'Username Taken'
        })
      }
      return
    }
  })
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
  path: API_PREFIX+'/user/auth',
  handler: authRoute
})

Routes.push({
  method: 'POST',
  path: API_PREFIX+'/user/signup',
  handler: signupRoute
})





module.exports = Routes