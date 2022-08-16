import { RequestParams } from '../../lib/service/requestParams.js';
import { METHOD_TYPES } from '../../lib/enum/methodTypes';
import { getFunctionResult } from '../__utils__';


const testrequestSchema = {
  postMethod: {
    method: 'POST',
    url: '/auth/login/',
    secure: false,
    roles: [],
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Credentials: 'include'
    },
    schema: {
      title: 'Payload data schema of test POST request',
      description: 'That is data schema for testing the RequestParams class with POST method',
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
    url: '/auth/logout/{{id}}',
    secure: false,
    roles: [],
    headers: {
      Accept: 'application/json',
      Credentials: 'include'
    },
    schema: {
      title: 'Payload data schema of test GET request',
      description: 'That is data schema for testing the RequestParams class with GET method',
      type: 'object',
      properties: {
        'hard': {
          type: 'Boolean'
        },
      }
    }
  },
};

function getRequestParams( testrequestSchema ) {
  return new RequestParams( testrequestSchema );
}

test( 'Request Parameters - prepareBodyRequest(defaultRequestParams, data)', () => {
  const expectedResult = {
    url: null,
    fetchParams: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Credentials: 'include'
      },
      body: {
        username: 'username1',
        passowrd: 'password1'
      }
    },
    security: {
      secure: false,
      roles: []
    }
  };

  expect( getFunctionResult( () => {
    const reqParams = getRequestParams( testrequestSchema.postMethod );
    const requestParams = reqParams.getDefaultRequestParams();
    const requestPayload = {
      username: 'username1',
      passowrd: 'password1'
    };

    reqParams.prepareUseBodyRequest( requestParams, requestPayload );

    return requestParams;
  } ) ).toEqual( expectedResult );
} );

test( 'Request Parameters - insertQueryParams(url, queryParams)', () => {
  expect( getFunctionResult( () => {
    const reqParams = getRequestParams( testrequestSchema.postMethod );
    const queryParams = {
      title: 'title1',
      offset: 'offset-15'
    };

    const baseUrl = reqParams.requestSchema.url;

    return reqParams.insertQueryParams( baseUrl, queryParams );
  } ) ).toEqual( '/auth/login/?title=title1&offset=offset-15' );
} );

test( 'Request Parameters - defineMethodType(useBodyMethod)', () => {
  expect( getFunctionResult( () => {
    const reqParams = getRequestParams( testrequestSchema.postMethod );
    const requestMethod = reqParams.requestSchema.method;
    return reqParams.defineMethodType( requestMethod );
  } ) ).toEqual( METHOD_TYPES.USE_BODY.NAME );
} );

test( 'Request Parameters - defineMethodType(useQueryParamsMethod)', () => {
  expect( getFunctionResult( () => {
    const reqParams = getRequestParams( testrequestSchema.getMethod );
    const requestMethod = reqParams.requestSchema.method;
    return reqParams.defineMethodType( requestMethod );
  } ) ).toEqual( METHOD_TYPES.USE_QUERY_PARAMS.NAME );
} );


test( 'Request Parameters - inserUrlId( Id )', () => {
  expect( getFunctionResult( () => {
    const reqParams = getRequestParams( testrequestSchema.getMethod );
    return reqParams.insertUrlId( 'testId123' );
  } ) ).toEqual( '/auth/logout/testId123' );
} );


test( 'Request Parameters - POST getRequestParams(data)', () => {
  const expectedObject = {
    url: '/auth/login/',
    fetchParams: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Credentials: 'include'
      },
      body: {
        username: 'username1',
        password: 'password1'
      }
    },
    security: {
      secure: false,
      roles: []
    }
  };

  expect( getFunctionResult( () => {
    const reqParams = getRequestParams( testrequestSchema.postMethod );
    const requestPayload = {
      username: 'username1',
      password: 'password1'
    };

    return reqParams.getRequestParams( requestPayload );
  } ) ).toEqual( expectedObject );
} );


test( 'Request Parameters - GET getRequestParams(data, id)', () => {
  const expectedObject = {
    url: '/auth/logout/testId123?param1=val1&param2=val2&param3=val3',
    fetchParams: {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Credentials: 'include'
      },
    },
    security: {
      secure: false,
      roles: [],
    }
  };

  expect( getFunctionResult( () => {
    const reqParams = getRequestParams( testrequestSchema.getMethod );
    const requestPayload = {
      param1: 'val1',
      param2: 'val2',
      param3: 'val3'
    };

    return reqParams.getRequestParams( requestPayload, 'testId123' );

  } ) ).toEqual( expectedObject );
} );
