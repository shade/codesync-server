//////////////////////////////////////////////////////////////////////////////
// This entire JS file is dedicated to that cute animation on the homepage. //
//////////////////////////////////////////////////////////////////////////////

// Grab appropriate header elements.
var main__header = document.getElementById('main__header').children[0]
var main__subheader = document.getElementById('main__subheader').children[0]

// Create arrays for the data that needs to be inputted.
var mainString = "Your Team, ".split('')
var subString = "In Real Time.".split('')

// Go through every character and append it to the elements.
setInterval(function () {
  mainString.length && (main__header.innerHTML += mainString.shift())
  subString.length && (main__subheader.innerHTML += subString.shift())
}, 100)

// Wow, so easy. So Simple.