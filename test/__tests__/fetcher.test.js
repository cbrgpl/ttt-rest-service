import { Fetcher } from '../../lib/service/fetcher.js';
import { getFunctionResult, getFunctionCaller } from '../__utils__';

globalThis.fetch = jest.fn();

const getFakeRequestParameters = ( handlerName ) => {
  return {
    getRequestParams( data, id ) {
      return {
        url: handlerName + '/fake-url/' + id,
        fetchParams: {
          method: 'FAKE_METHOD',
          data,
        }
      };
    }
  };
};

const testRequestMap = new Map( [
  [ 'request1', getFakeRequestParameters( 'request1' ) ],
  [ 'request2', getFakeRequestParameters( 'request2' ) ]
] );

function getFetcher( requestMap ) {
  return new Fetcher( requestMap );
}

test( 'Fetcher - constructor( testRequestMap )', () => {
  expect( getFunctionResult( () => {
    const fetcher = getFetcher( testRequestMap );
    return true;
  } ) ).toBeTruthy();
} );

test( 'Fetcher - request({existingHandlerName, data, id})', () => {
  const expectFetchArgs = [
    'request1/fake-url/test123',
    {
      method: 'FAKE_METHOD',
      data: {
        prop1: 'val1',
        prop2: 'val2'
      }
    }
  ];

  expect( getFunctionResult( () => {
    const fetcher = getFetcher( testRequestMap );

    const handlerName = 'request1';
    const id = 'test123';
    const data = {
      prop1: 'val1',
      prop2: 'val2'
    };

    fetcher.request( { handlerName, data, id } );
    return fetch.mock.calls[ 0 ];
  } ) ).toEqual( expectFetchArgs );
} );

test( 'Fetcher - request({notExistingHandlerName})', () => {
  expect( getFunctionCaller( () => {
    const fetcher = getFetcher( testRequestMap );

    const handlerName = 'not_existed_handler';
    fetcher.request( { handlerName  } );
  } ) ).toThrow( 'Request parameters for handler with name not_existed_handler' );
} );
