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


async function test() {
  const { Fetcher } = require( './../service/fetcher' );
  const fetcher = new Fetcher( API.auth );

  fetcher.onBeforeFetch( ( requestParams ) => {
    console.log( requestParams );
  } );

  const request = await fetcher.request( {
    handlerName: 'login',
    data: {
      body: 1,
      hard: true
    },
    id: 'id_2ie',
  } );
}


module.exports.test = async function() {
  const { fetchPolyfill } = await import( './../fetch-polyfill.js' );
  await fetchPolyfill();

  test();
};
