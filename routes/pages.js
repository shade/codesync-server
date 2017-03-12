
//////////////////////
// SETUP THE ROUTES //
//////////////////////

var Routes = []


var ROUTE_VIEW_PAIRS = {
  '/home': 'user/home',
  '/r/{repo?}': 'user/repo',
  '/search': 'user/search',
  '/profile': 'user/profile',
  '/': 'home'
}




for (var route in ROUTE_VIEW_PAIRS) {
  var view = ROUTE_VIEW_PAIRS[route]

  // push the normal route.
  Routes.push({
    method: 'GET',
    path: route,
    handler: (request, reply) => (reply.view(view, {}))
  })

  // push the iframe view.
  Routes.push({
    method: 'GET',
    path: `/pages${route}`,
    handler: (request, reply) => (reply.view(`pages${view}`, {}))
  })
}


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