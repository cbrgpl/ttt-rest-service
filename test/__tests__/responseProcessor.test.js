const { ResponseProcessor } = require( './../../libs/service/responseProcessor' );
const { StatusError } = require( './../../libs/error/statusError' );

const { getFunctionCaller, getFunctionResult } = require( './../__utils__' );

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

const getResponseProcessor = ( mimeParser, invalidStatuses ) => {
  return new ResponseProcessor( mimeParser, invalidStatuses );
};

test( 'Response Processor - validateResponseStatus( validStatus )', () => {
  expect( getFunctionResult( () => {
    const rp = getResponseProcessor( mimeParser, invalidStatuses );
    const fakeHttpResponse = {
      status: 200
    };

    rp.validateResponseStatus( fakeHttpResponse );

    return true;
  } ) ).toBeTruthy();
} );

test( 'Response Processor - validateResponseStatus( invalidStatus )', () => {
  expect( getFunctionCaller( () => {
    const rp = getResponseProcessor( mimeParser, invalidStatuses );
    const fakeHttpResponse = {
      status: 501
    };

    rp.validateResponseStatus( fakeHttpResponse );
  } ) ).toThrow( StatusError );
} );


test( 'Response Processor - processResponse( httpResponse )', async () => {
  const expectedObject = {
    httpResponse: {
      data: {
        prop1: 'prop1',
        val1: null
      },
    },
    parsedBody: {
      prop1: 'prop1',
      val1: null,
      parsed: true
    }
  };

  expect( await getFunctionResult( () => {
    const rp = getResponseProcessor( mimeParser, invalidStatuses );
    const fakeHttpResponse = {
      data: {
        prop1: 'prop1',
        val1: null
      }
    };

    return rp.processResponse( fakeHttpResponse );
  } ) ).toEqual( expectedObject );
} );
