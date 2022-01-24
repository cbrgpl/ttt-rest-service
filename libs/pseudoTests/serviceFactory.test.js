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
  const { MimeParser } = require( '../service/mimeParser' );

  const mimeParserPairs = [
    [
      'application/json',
      ( data ) => console.log( 'app/json', data )
    ]
  ];

  const mimeParser = new MimeParser( mimeParserPairs );
  const responseProcessor = new ResponseProcessor( mimeParser );

  const serviceFactory = new ServiceFactory( {
    responseProcessor
  } );

  const factoryConstructorArgs = {
    responseProcessor,
  };

  const services = ServiceFactory.getServicesForApi( ServiceFactory, factoryConstructorArgs, API );

  console.log( services );
}


module.exports.test = async function() {
  const { fetchPolyfill } = await import( './../fetch-polyfill.js' );
  await fetchPolyfill();

  test();
};
