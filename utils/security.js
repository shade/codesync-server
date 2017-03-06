// This utils package handles all the security needs.

// Set up the requirements.
const Crypto = require('crypto')
const Bcrypt = require('bcrypt')

// Some Constants
const SALT_ROUNDS = 10
const API_HMAC_KEY = 'wv1eDxOG28T2e16QdaDpJoe is the best programmer ever.sYqgi9e4ZCClc7K1cxT6'



// Function for handling hashing, returns a promise.
function hash (password) {
  return Bcrypt.hash(password, SALT_ROUNDS)
}

// Function for comparing a DB hashed password to another one. Returns a promise, true or false.
function compare (plainPass, hashPass) {
  return Bcrypt.compare(plainPass, hashPass)
}

// Function to create a token from some information.
function tokenify (data) {
  return Crypto.createHmac('sha256', API_HMAC_KEY).update(data).digest('base64')
}



module.exports = {
  hash: hash,
  compare: compare,
  tokenify: tokenify
}

