
//////////////////////
// SETUP THE ROUTES //
//////////////////////

var Routes = []

/** Session routes. */
Routes.push({
  method: 'GET',
  path: '/home',
  handler: (request, reply) => (reply.view('user/home', {}))
})
Routes.push({
  method: 'GET',
  path: '/r/{repo?}',
  handler: (request, reply) => (reply.view('user/repo', {}))
})


/** Iframe Session routes */
Routes.push({
  method: 'GET',
  path: '/pages/home',
  handler: (request, reply) => (reply.view('user/pages/home', {}))
})
Routes.push({
  method: 'GET',
  path: '/pages/r/{repo?}',
  handler: (request, reply) => (reply.view('user/pages/repo', {}))
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