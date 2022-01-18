const API = {
  auth: [
    {
      method: 'POST',
      path: '/auth/login',
      secure: false,
      useBody: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Credentials: 'include'
      },
      schema: {
        type: 'object',
        required: [ 'username', 'password' ],
        properties: {
          username: {
            type: 'string',
            minLength: 3
          },
          password: {
            type: 'string',
            minLength: 6
          }
        }
      },
      handler: 'login',
      roles: []
    },
    {
      method: 'GET',
      path: '/auth/logout/{{id}}',
      secure: true,
      useBody: false,
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
      useBody: true,
      schema: {
        // ...
      },
      handler: 'registrate',
      roles: []
    }
  ],
};

async function test() {
  const { Service } = require( './../service/service' );
  const { ResponseProcessor } = require( './../service/responseProcessor' );

  const mimeParserPairs = {
    'application/json': ( data ) => console.log( 'app/json', data )
  };
  const responseProcessor = new ResponseProcessor( mimeParserPairs );

  const service = new Service( {
    moduleScheme: API.auth,
    responseProcessor,
    name: 'auth',
  } );

  service.onBeforeRequest( 'login', ( args ) => {
    console.log( 'onBeforeRequest' );
    console.log( args );
    console.log( '\n\n\n' );
  } );

  service.onBeforeFetch( ( requestParams ) => {
    console.log( 'onBeforeFetch' );
    console.log( requestParams );
    console.log( '\n\n\n' );
  } );


  service.onResponseHandled( ( handledResponse ) => {
    console.log( 'onResponseHandled' );
    console.log( handledResponse );
    console.log( '\n\n\n' );
  } );

  service.addHandler( {
    handlerName: API.auth[ 0 ].handler,
    dataSchema: API.auth[ 0 ].schema
  } );

  const request = await service.login( {
    username: 'cybirgpl',
    password: 'jeppka22'
  } );
}


module.exports.test = async function() {
  const { fetchPolyfill } = await import( './../fetch-polyfill.js' );
  await fetchPolyfill();

  test();
};
