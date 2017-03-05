/**
 * This routes file is for all user related actions.
 */
var Routes = []


/**
 * `auth` - returns the token based on username and password. Also stores ide.
 */
Routes.push({
  method: 'POST',
  path: '/auth',
  handler: (request, reply) => {
    request.payload.username
    request.payload.password

    request.payload.ide_id
  }
})



module.exports = Routes