const Security = require('../../utils/security')
const NAME_BASE = 'UnnamedSpace'

var Routes = []


var spaceCreate = (request, reply) => {
  var user
  // Make sure the token is cool. Also, extract the user.
  if (!(user = Security.verify(request, reply))) return

  // Holds the new name.
  var name = NAME_BASE
  var counter = 0

  // Find all the spaces created by the current user.
  Models.Space.find({creator: user}, (err, spaces) => {
    if (err) {
      reply({
        error: 'Database error :('
      })
      return
    }

    // Create an object to hold the names of all the spaces.
    // Loop through the spaces, add their names to the object.
    var spaceNames = {}
    spaces.forEach(space => (spaceNames[space.name] = 1))

    // Make sure we get a new name that isn't taken.
    while (spaceNames[name]) {
      name = NAME_BASE + (++counter)
    }

    // Now that we have a name that isn't taken, save it and return it.
    var space = new Models.Space({
      name: name,
      creator: user,
      users: [{
        username: user,
        level: 'Creator'
      }],
      created: Date.now()
    })

    // Save the space.
    space.save((err) => {
      // Return an error, if there is one.
      if (err) {
        reply({
          error: 'Database error, saving your space :('
        })
        return
      }

      // Since it worked, send back the space name.
      reply({
        space: name
      })
    })

  })
}


Routes.push({
  method: 'POST',
  path: '/space/create',
  handler: spaceCreate
})

module.exports = Routes