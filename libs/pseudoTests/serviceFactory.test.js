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
      headers: {
        Accept: 'application/json',
        Credentials: 'include'
      },
      schema: {
        // ...
      },
      handler: 'registrate',
      roles: [  ]
    },
  ],
  user: [
    {
      method: 'GET',
      path: '/user/get/{{id}}',
      secure: true,
      headers: {
        Accept: 'application/json',
        Credentials: 'include'
      },
      schema: {
        // ...
      },
      handler: 'userGet',
      roles: [ ]
    },
    {
      method: 'PUT',
      path: '/auth/put/{{id}}',
      secure: true,
      headers: {
        Accept: 'application/json',
        Credentials: 'include'
      },
      schema: {
        // ...
      },
      handler: 'userPut',
      roles: [ 'user' ]
    },
  ]
};


async function test() {
  const { ServiceFactory } = require( './../service/serviceFactory' );
  const { ResponseProcessor } = require( './../service/responseProcessor' );

  const mimeParserPairs = {
    'application/json': ( val ) => {
      console.log( 'mimeParser', val );
      return val;
    }
  };
  const responseProcessor = new ResponseProcessor( mimeParserPairs );

  const serviceFactory = new ServiceFactory( {
    responseProcessor
  } );


  const services = ServiceFactory.generateServices( serviceFactory, API );

  console.log( services );
}


module.exports.test = async function() {
  const { fetchPolyfill } = await import( './../fetch-polyfill.js' );
  await fetchPolyfill();

  test();
};
