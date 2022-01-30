const { Service } = require( './../../libs/service/service' );
const { ValidationError } = require( './../../libs/error/validationError' );

const { getFunctionResult, getFunctionCaller } = require( './../__utils__' );

const getService = ( fetcher, responseProcessor, name ) => {
  return new Service( fetcher, responseProcessor, name );
};

const examplePayloadSchema = {
  type: 'object',
  properties: {
    stringProperty: {
      type: 'string'
    },
    requiredNumberProperty: {
      type: 'number'
    }
  },
  required: [ 'requiredNumberProperty' ]
};

test( 'Service - addHandler( validName )', () => {
  expect( getFunctionResult( () => {
    const service = getService( null, null, 'testService' );
    const handlerName = 'handler1';

    service.addHandler( handlerName );

    return typeof service.handler1 === 'function';
  } ) ).toBeTruthy();
} );

test( 'Service - addHandler( alreadyExistName )', () => {
  expect( getFunctionCaller( () => {
    const service = getService( null, null, 'testService' );
    const handlerName = 'handler1';

    service.addHandler( handlerName );
    service.addHandler( handlerName );
  } ) ).toThrow( 'Service property with name handler1 already exists' );
} );

test( 'Service - validateData(noData, noSchema, handlerName) validation with default validator', () => {
  expect( getFunctionResult( () => {
    const service = getService( null, null, 'testService' );
    const handlerName = 'handler1';

    service.addHandler( handlerName );

    return service.validateData( null, null, 'handler1' );
  } ) ).toBeTruthy();
} );

test( 'Service - validateData(validData, schema, handlerName)', () => {
  expect( getFunctionResult( () => {
    const service = getService( null, null, 'testService' );
    const handlerName = 'handler1';

    service.addHandler( handlerName, examplePayloadSchema );

    const fakePayload = {
      stringProperty: 'QWE',
      requiredNumberProperty: 1
    };

    return service.validateData( fakePayload, examplePayloadSchema, 'handler1' );
  } ) ).toBeTruthy();
} );

test( 'Service - validateData(invalidData, schema, handlerName)', () => {
  expect( getFunctionCaller( () => {
    const service = getService( null, null, 'testService' );
    const handlerName = 'handler1';

    service.addHandler( handlerName, examplePayloadSchema );

    const fakePayload = {
      stringProperty: 'QWE',
      requiredNumberProperty: null
    };

    return service.validateData( fakePayload, examplePayloadSchema, 'handler1' );
  } ) ).toThrow( ValidationError );
} );


test( 'Service - request({existingHandlerName, data, id}) test fetch args', () => {
  const mockFn = jest.fn( ( val ) => val );

  const requestArgs = {
    handlerName: 'handlerName1',
    data: { prop1: 'prop1' },
    id: 'testId1'
  };

  expect( getFunctionResult( () => {
    const fakeFetcher = {
      request: mockFn
    };

    const service = getService( fakeFetcher, null, 'testService' );

    service.request( requestArgs );

    return mockFn.mock.calls[ 0 ][ 0 ];
  } ) ).toEqual( requestArgs );
} );

test( 'Service - request({existingHandlerName, data, id}) test result with responseProcessor = null', async () => {
  const mockFn = jest.fn( ( val ) => val );

  const requestArgs = {
    handlerName: 'handlerName1',
    data: { prop1: 'prop1' },
    id: 'testId1'
  };

  expect( await getFunctionResult( () => {
    const fakeFetcher = {
      request: mockFn
    };

    const service = getService( fakeFetcher, null, 'testService' );

    return service.request( requestArgs );
  } ) ).toEqual( requestArgs );
} );

test( 'Service - request({existingHandlerName, data, id}) test response processor handling ', async () => {
  const mockFn = jest.fn( ( args ) => {
    args.responseProcessor = true;
    return args;
  } );

  const expectResult = {
    handlerName: 'handlerName1',
    data: {
      prop1: 'prop1'
    },
    id: 'testId1',
    responseProcessor: true
  };

  expect( await getFunctionResult( () => {
    const fakeFetcher = {
      request( args ) {
        return args;
      }
    };

    const fakeResponseProcessor = {
      processResponse: mockFn
    };

    const service = getService( fakeFetcher, fakeResponseProcessor, 'testService' );

    return service.request( { handlerName: 'handlerName1', data: { prop1: 'prop1' }, id: 'testId1' } );
  } ) ).toEqual( expectResult );
} );

test( 'Service - request({existingHandlerName, data, id}) test hooks ', async () => {
  const mockFn = jest.fn( ( args ) => Object.assign( {}, args ) );

  const expectResult = {
    beforeRequestArgs: {
      handlerName: 'req1',
      data: {
        prop1: 'prop1'
      },
      id: 'id_1'
    },
    responseHandledArgs: {
      handledResponse: {
        handlerName: 'req1',
        data: {
          prop1: 'prop1'
        },
        id: 'id_1',
        fetched: true,
        processed: true
      }
    },
  };


  expect( await getFunctionResult( async () => {
    const fakeFetcher = {
      request( args ) {
        args.fetched = true;
        return args;
      }
    };

    const fakeResponseProcessor = {
      processResponse( httpResponse ) {
        httpResponse.processed = true;
        return httpResponse;
      }
    };

    const service = getService( fakeFetcher, fakeResponseProcessor, 'testService' );

    service.onBeforeRequest( mockFn );
    service.onResponseHandled( mockFn );

    const result = await service.request( {
      handlerName: 'req1',
      data: {
        prop1: 'prop1'
      },
      id: 'id_1'
    } );

    return {
      beforeRequestArgs: mockFn.mock.calls[ 0 ][ 0 ],
      responseHandledArgs: mockFn.mock.calls[ 1 ][ 0 ],
    };
  } ) ).toEqual( expectResult );
} );
