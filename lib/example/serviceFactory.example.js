const API = {
  auth: [
    {
      method: 'POST',
      url: '/auth/login',
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
      url: '/auth/logout/{{id}}',
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
      url: '/auth/registrate',
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
      url: '/user/get/{{id}}',
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
      url: '/auth/put/{{id}}',
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
  const { ServiceFactory } = require( '../factory/serviceFactory' );
  const { ResponseHandler } = require( '../service/responseHandler' );
  const { MimeParser } = require( '../service/mimeParser' );
  const { FetcherFactory } = require( '../factory/fetcherFactory' );

  const mimeParserPairs = [
    [
      'application/json',
      ( data ) => console.log( 'app/json', data )
    ]
  ];

  const fetcherFactory = new FetcherFactory();
  const mimeParser = new MimeParser( mimeParserPairs );
  const responseHandler = new ResponseHandler( mimeParser );

  const serviceFactory = new ServiceFactory( fetcherFactory, responseHandler );



  const services = serviceFactory.generateServices( API );

  console.log( services );
}


module.exports.test = async function() {
  const { fetchPolyfill } = await import( '../fetch-polyfill.js' );
  await fetchPolyfill();

  test();
};
