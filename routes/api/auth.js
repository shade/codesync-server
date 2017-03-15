
// Declare the packages.
const Async = require('async')
const Validator = require('email-validator');
const Yar = require('yar')

const Security = require('../../utils/security')


// Declare the constants.
// The length of the token. This is: 1 year in ms.
const TOKEN_EXPIRY_TIME = 3.154e10
const API_PREFIX = '/api/v1'


// This handles all /auth token requests.
// NOTE: ASYNC REQUIRES FULL FUNCTION NOTATION. ARROW FUNCTIONS WILL NOT WORK!
var authRoute = (request, reply) => {
  // Grab the necessary params.
  var {username, password, ide_id} = request.payload

  // Check to see if the request params are cool.
  if (!username) {
    reply({ error: "You didn't provide a username" })
    return
  }
  if (!password) {
    reply({ error: "You didn't provide a password" })
    return
  }

  Async.waterfall([
    function (cb) {
      // Find the user using the model.
      Models.User.findOne({username: username}, (error, result) => {
        if (error || !result) {
          cb('User not found')
        } else {
          cb(null, result)
        }
      })
    },
    function (user, cb) {
      // Compare the password the user sent to the db one.
      Security.compare(password, user.password).then((valid) => {
        if (valid) {
          cb(null, user)
        } else {
          cb('This is a bad password')
        }
      })
    }
  ], function (err, user) {
    // If there was an error send it out. 
    // Else, send a token.
    if (err) {
      reply({
        error: err
      })
    } else {
      reply({
        token: Security.createUserToken(user, TOKEN_EXPIRY_TIME),
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

  // Check if the request params are provided
  if (!username) {
    reply({ error: "You didn't provide a username" })
    return
  }
  if (!password) {
    reply({ error: "You didn't provide a password" })
    return
  }
  if (!email) {
    reply({ error: "You didn't provide a email" })
    return
  }

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
  // Check if the request params are provided
  if (!username_email) {
    reply({ error: "You didn't provide a username or email" })
    return
  }
  if (!password) {
    reply({ error: "You didn't provide a password" })
    return
  }
  username_email = username_email.toLowerCase()

  // Check this username/email's existence in the database.
  Models.User.findOne({
    $or: [
      {email: username_email},
      {username: username_email}
    ]
  }, {}, (err, user) => {
    if (err || !user) {
      reply({
        error: 'User not found, (did you enter your username wrong?)'
      })
      return
    }

    // Compare the password the user sent to the db one.
    Security.compare(password, user.password).then((valid) => {
      if (valid) {
        cb(null, user)
      } else {
        reply({
          error: 'This is a bad password'
        })
      }
    })
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