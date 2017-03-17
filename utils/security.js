// This utils package handles all the security needs.

// Set up the requirements.
const Crypto = require('crypto')
const Bcrypt = require('bcrypt')

// Some Constants
const SALT_ROUNDS = 10
const API_HMAC_KEY = 'wv1eDxOG28T2e16QdaDpJoe is the best programmer ever.sYqgi9e4ZCClc7K1cxT6'
const TOKEN_DELIMETER = '^_^'


// Function for handling hashing, returns a promise.
function hash (password) {
  return Bcrypt.hash(password, SALT_ROUNDS)
}

// Function for comparing a DB hashed password to another one. Returns a promise, true or false.
function compare (plainPass, hashPass) {
  return Bcrypt.compare(plainPass, hashPass)
}

// Function creates a token for users from the user object.
function createUserToken (user, expire) {
  var token = user.username
  token += TOKEN_DELIMETER
  token += tokenify(user.username)
  return token
}

// Function to create a token from some information.
function tokenify (data) {
  return Crypto.createHmac('sha256', API_HMAC_KEY).update(data).digest('base64')
}

// Check to see if this token is valid
function validToken (token) {
  // Split the token.
  var hash
  var raw
  [raw, hash] = token.split(TOKEN_DELIMETER)

  return Crypto.createHmac('sha256', API_HMAC_KEY).update(raw).digest('base64') == hash
}

// Checks to see if this route is valid.
// If it is, return the user.
function verify (request, reply) {
  var token = request.query.t

  // If the token is bad, return false and tell the user.
  if (!validToken(token)) {
    reply({
      error: "Invalid Token"
    })
    
    return false
  }

  // Since this is a valid token, return the delimeter.
  return token.split(TOKEN_DELIMETER)[0]
}


module.exports = {
  hash: hash,
  compare: compare,
  tokenify: tokenify,
  createUserToken: createUserToken,
  validToken: validToken,
  verify: verify
}
