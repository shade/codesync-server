
//////////////////////
// SETUP THE ROUTES //
//////////////////////

var Routes = []

Routes.push({
  method: 'GET',
  path: '/home',
  handler: (request, reply) => (reply.view('user/home', {}))
})

/** Non session routes. */
Routes.push({
  method: 'GET',
  path: '/',
  handler: (request, reply) => (reply.view('home', {}))
})
Routes.push({
  method: 'GET',
  path: '/login',
  handler: (request, reply) => (reply.view('auth/login', {}))
})
Routes.push({
  method: 'GET',
  path: '/email',
  handler: (request, reply) => (reply.view('auth/email', {}))
})
Routes.push({
  method: 'GET',
  path: '/signup',
  handler: (request, reply) => (reply.view('auth/signup', {}))
})

// Handle static files. CSS JS and IMGS.
Routes.push({  
  method: 'GET',
  path: '/static/{file*}',
  handler: {
    directory: { 
      path: './static'
    }
  }
})

module.exports = Routes