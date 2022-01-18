const { ApiModule } = require( './../service/apiModule.js' );

const API = {
  auth: [
    {
      method: 'POST',
      path: '/auth/login',
      secure: false,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Credentials: 'include'
      },
      schema: {
        // ...
      },
      handler: 'login',
      roles: []
    },
    {
      method: 'GET',
      path: '/auth/logout/{{id}}',
      secure: true,
      headers: {
        Accept: 'application/json',
        Credentials: 'include'
      },
      schema: {
        // ...
      },
      handler: 'logout',
      roles: [ 'user' ]
    },
    {
      method: 'POST',
      path: '/auth/registrate',
      secure: false,
      schema: {
        // ...
      },
      handler: 'registrate',
      roles: []
    }
  ],
};




module.exports.test = function() {
  const apiModule = new ApiModule( API.auth );

  const requestParams = {};

  requestParams[ 'login' ] = apiModule.getRequestParams( 'login', { body: 1 } );
  requestParams[ 'logout' ] = apiModule.getRequestParams( 'logout', { hard: true, time: 5 }, 'id_121' );

  console.log( 'q' );
};
