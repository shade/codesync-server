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


var spaceDelete = (request, reply) => {
  var user
  // Make sure the token is cool. Also, extract the user.
  if (!(user = Security.verify(request, reply))) return

  // Make sure they provided a name to be deleted, otherwise escape.
  if (!request.query.name) {
    reply({
      error: 'No name provided'
    })
    return
  }

  // Only the user who created the space can delete it.
  Models.Space.findOne({name: name, creator: user}, {}, (err, doc) => {
    // If there's an error, or the name doesn't exist, tell the people.
    if (err || !doc) {
      reply({
        error: "Either this space doesn't exist, or you didn't create it. Only creators can delete their spaces"
      })
      return
    }

    // Since a document was found, delete it. 
    Models.Space.remove({_id: doc._id}, (err) => {
      // If there's an error, tell the user, otherwise quit.
      if (err) {
        reply({
          error: 'Database error, could not remove space'
        })
        return
      }

      // No error, tell them it went fine.
      reply({
        good: 'Everything went smoothly, the space is now gone.'
      })
    })
  })
}

var spaceAdd = (request, reply) => {
  var user
  // Make sure the token is cool. Also, extract the user.
  if (!(user = Security.verify(request, reply))) return


  request.query.user
}




Routes.push({
  method: 'POST',
  path: '/space/create',
  handler: spaceCreate
})

Routes.push({
  method: 'POST',
  path: '/space/delete',
  handler: spaceDelete
})  

Routes.push({
  method: 'POST',
  path: '/space/add',
  handler: spaceAdd
})

module.exports = Routes