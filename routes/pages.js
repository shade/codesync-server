




var homeView = (request, reply) => {
  reply.view('home', {})
}
var loginView = (request, reply) => {
  reply.view('login', {})
}


//////////////////////
// SETUP THE ROUTES //
//////////////////////

var Routes = []

Routes.push({
  method: 'GET',
  path: '/',
  handler: homeView
})
Routes.push({
  method: 'GET',
  path: '/login',
  handler: loginView,
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