// Initialize constants.
const API_PREFIX = '/api/v1'

var AuthBox = new Vue({
  el: '#auth',
  data: {
    login: true,
    loading: false,
    errorMsg: "",
    goodMsg: "",
    login: {
      username: '',
      password: ''
    },
    signup: {
      username: '',
      password: '',
      email: ''
    }
  }
})

/** Toggles the login property if posssible. */
AuthBox.toggleLogin = function () {

  // If we're logging or signing up, let that finish first.
  if (this.loading) {
    return
  }

  this.login = !this.login
}

AuthBox.login = function (event) {
  // Stop the form from submitting!
  event.preventDefault()
  // Set loading to true and get rid of errors.
  this.loading = true
  this.errorMsg = ""

  // Create and send the request!
  var request = new XMLHttpRequest()
  request.open('POST', API_PREFIX + '/user/login', true)
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.onload = function () {
    // No matter what happens, stop the loading.
    AuthBox.loading = false
    // Attempt to parse the JSON.
    var json = JSON.parse(request.responseText)
    // Check if there's an error in the json.
    if (json.error) {
      AuthBox.errorMsg = json.error
    } else {
      // If there's a good thing, show it, and change the location.
      AuthBox.goodMsg = json.good
      setTimeout(function () {
        document.location = '/home'
      }, 1000)
    }
  }
  request.onerror = function () {
    // No matter what happens, stop the loading.
    AuthBox.loading = false
  }
  request.send(`username_email=${this.login.username}&password=${this.login.password}`)
}

AuthBox.signup = function (event) {
  // Stop the form from submitting!
  event.preventDefault()
  // Set loading to true and get rid of errors.
  this.loading = true
  this.errorMsg = ""

  // Create and send the request!
  var request = new XMLHttpRequest()

  request.open('POST', API_PREFIX + '/user/signup', true)
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.onload = function () {
    // No matter what happens, stop the loading.
    AuthBox.loading = false
    // Attempt to parse the JSON.
    var json = JSON.parse(request.responseText)
    // Check if there's an error in the json.
    if (json.error) {
      AuthBox.errorMsg = json.error
    } else {
      // If there's a good thing, show it, and change the location.
      AuthBox.goodMsg = json.good
      setTimeout(function () {
        document.location = '/home'
      }, 1000)
    }
  }
  request.onerror = function () {
    // No matter what happens, stop the loading.
    AuthBox.loading = false
  }
  request.send(`username=${this.signup.username}&password=${this.signup.password}&email=${this.signup.email}`)
}












