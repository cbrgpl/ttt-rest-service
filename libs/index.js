// const { test } = require( './example/service.example' );

// test();
const { RequestParameters } = require( './service/requestParameters' );
const { Service } = require( './service/service' );

const testRequestMetadata = {
  postMethod: {
    method: 'POST',
    url: '/auth/login',
    secure: false,
    roles: [],
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Credentials: 'include'
    },
    schema: {
      title: 'Payload data schema of test POST request',
      description: 'That is data schema for testing the RequestParameters class with POST method',
      type: 'object',
      properties: {
        'username': {
          type: 'String'
        },
        password: {
          type: 'String'
        }
      }
    }
  },
  getMethod: {
    method: 'GET',
    url: '/auth/logout',
    secure: false,
    roles: [],
    headers: {
      Accept: 'application/json',
      Credentials: 'include'
    },
    schema: {
      title: 'Payload data schema of test GET request',
      description: 'That is data schema for testing the RequestParameters class with GET method',
      type: 'object',
      properties: {
        'hard': {
          type: 'Boolean'
        },
      }
    }
  },
};

function getRequestParameters( testRequestMetadata ) {
  return new RequestParameters( testRequestMetadata );
}

const requestParameters = getRequestParameters( testRequestMetadata.postMethod );
const requestParams = requestParameters.getDefaultRequestParams();
const requestPayload = {
  username: 'username1',
  passowrd: 'password1'
};

requestParameters.prepareUseBodyRequest( requestParams, requestPayload );

const service = new Service( { request( args ) { return args; } }, { processResponse( args ) { return args;} }, 'name1' );
const fn = () => console.log( 'before fetch' );
service.onBeforeRequest( fn );
service.onResponseHandled( fn );

service.request( { handlerName: 'h1', data: { prop: false } } );
