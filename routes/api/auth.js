
// Declare the packages.
const Async = require('async')
const Validator = require('email-validator');
const Yar = require('yar')

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
  if (username.match(/([^A-Za-z0-9-]|-{2,})/g) || ul > 40 || ul < 4 || username[0] == '-' || username[ul-1] == '-') {
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
  Models.User.find({
    $or:[
      {email: email},
      {username: username}
    ]
  }, {}, (err, result) => {

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


    // Since we didn't find a match, we can create a user!
    // Step 1: Hash the password.
    Security.hash(password).then((hashedPass) => {
      // Step 2: Create the mongoose object.
      var user = new Models.User({
        username: username,
        password: hashedPass,
        verified: false,
        personal: {
          name: '',
          email: email
        }
      })

      // Step 3: Email the user a verification. (Not Implemented Yet)
      // Step 4: Save the user to the database.
      user.save((err) => {
        // Tell the there's an error, and quit
        if (err) {
          console.log(err)
          reply({
            error: 'Database Error!'
          })
          return
        }

        // Send a good signal to the user.
        reply({
          good: 'Yay, signup worked'
        })
      })
    })



  })
}



// This handles all the /login requests.
var loginRoute = (request, reply) => {
  // Grab the variables from the post request.
  // The user can login with the email or the username.
  var {
    username_email,
    password
  } = request.payload

  username_email = username_email.toLowerCase()

  // Check this username/email's existence in the database.
  DB.find({
    $or: [
      {email: username_email},
      {username: username_email}
    ]
  }, {}, (err, result) => {

  })
}






//////////////////////
// SETUP THE ROUTES //
//////////////////////

var Routes = []

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

Routes.push({
  method: 'POST',
  path: API_PREFIX+'/user/login',
  handler: loginRoute
})





module.exports = Routes