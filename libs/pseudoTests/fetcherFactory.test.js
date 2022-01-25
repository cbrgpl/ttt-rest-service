const { FetcherFactory } = require( './../service/fetcherFactory.js' );

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
      schema: {
        // ...
      },
      handler: 'registrate',
      roles: []
    }
  ],
};




module.exports.test = function() {
  const fetcherFactory = new FetcherFactory();
  const fetcher = fetcherFactory.getFetcher( API.auth );
  const fetcherMap = fetcher.requestMap;

  const requestParams = {};

  requestParams[ 'login' ] = fetcherMap.get( 'login' ).getRequestParams( { body: 1 } );
  requestParams[ 'logout' ] = fetcherMap.get( 'logout' ).getRequestParams( { hard: true, time: 5 }, 'id_121' );

  console.log( 'q' );
};
