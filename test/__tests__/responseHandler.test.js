import { ResponseHandler } from './../../lib/service/responseHandler.js';
import { StatusError } from './../../lib/error/statusError';

import { getFunctionResult, getFunctionCaller } from '../__utils__';


const invalidStatuses = [ 501 ];
const mimeParser = {
  parseResponseBody( httpResponse ) {
    return new Promise( ( resolve, reject ) => {
      const clone = Object.assign( {}, httpResponse.data );
      clone.parsed = true;

      resolve( clone );
    } );
  }
};

const getResponseHandler = ( mimeParser, invalidStatuses ) => {
  return new ResponseHandler( mimeParser, invalidStatuses );
};

test( 'Response Handler - validateResponseStatus( validStatus )', () => {
  expect( getFunctionResult( () => {
    const rp = getResponseHandler( mimeParser, invalidStatuses );
    const fakeHttpResponse = {
      status: 200
    };

    rp.validateResponseStatus( fakeHttpResponse );

    return true;
  } ) ).toBeTruthy();
} );

test( 'Response Handler - validateResponseStatus( invalidStatus )', () => {
  expect( getFunctionCaller( () => {
    const rp = getResponseHandler( mimeParser, invalidStatuses );
    const fakeHttpResponse = {
      status: 501
    };

    rp.validateResponseStatus( fakeHttpResponse );
  } ) ).toThrow( StatusError );
} );


test( 'Response Handler - processResponse( response )', async () => {
  const expectedObject = {
    response: {
      data: {
        prop1: 'prop1',
        val1: null
      },
    },
    body: {
      prop1: 'prop1',
      val1: null,
      parsed: true
    }
  };

  expect( await getFunctionResult( () => {
    const rp = getResponseHandler( mimeParser, invalidStatuses );
    const fakeResponse = {
      data: {
        prop1: 'prop1',
        val1: null
      }
    };

    return rp.processResponse( fakeResponse );
  } ) ).toEqual( expectedObject );
} );
