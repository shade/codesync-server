
//////////////////////
// SETUP THE ROUTES //
//////////////////////

var Routes = []





Routes.push({method: 'GET', path: '/home', handler: (req,rep) => (rep.view('user/home', {}))})
Routes.push({method: 'GET', path: '/r/{repo?}', handler: (req,rep) => (rep.view('user/repo', {}))})
Routes.push({method: 'GET', path: '/search', handler: (req,rep) => (rep.view('user/search', {}))})
Routes.push({method: 'GET', path: '/profile', handler: (req,rep) => (rep.view('user/profile', {}))})
Routes.push({method: 'GET', path: '/', handler: (req,rep) => (rep.view('home', {}))})



///** Session routes. */
///** Iframe Session routes */
///** Non session routes. */
/*


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
Routes.push({
  method: 'GET',
  path: '/search',
  handler: (request, reply) => (reply.view('user/search', {}))
})
Routes.push({
  method: 'GET',
  path: '/profile',
  handler: (request, reply) => (reply.view('user/profile', {}))
})


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
})*/

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