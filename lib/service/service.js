import { ajv } from '../helper/ajv.js';

import { ValidationError } from '../error/validationError.js';

import { Hookable } from './hookable';
import { defaultHook } from '../helper/defaultHook';

const mapableArrayOfHooks = [
  [ 'beforeRequest', defaultHook ],
  [ 'responseHandled', defaultHook ]
];


export class Service extends Hookable {
  constructor( fetcher = null, responseHandler = null, name = null ) {
    super( mapableArrayOfHooks );

    this.name = name;

    this.fetcher = fetcher;
    this.responseHandler = responseHandler;

    this.ajvValidators = {}; // <handler, ajv-validator> pairs
  }

  async request( { name, requestPayload = {}, id } ) {
    const requestArgs = this.callHook( 'beforeRequest', arguments[ 0 ] ) || arguments[ 0 ];
    console.log( arguments[ 0 ] );
    const response = await this.fetcher.request( requestArgs );

    if( this.responseHandler !== null ) {
      const handledResponse =  await this.responseHandler.processResponse( response );

      this.callHook( 'responseHandled', handledResponse );
      return handledResponse;
    } else {
      return response;
    }
  }

  addHandler( name, requestPayloadSchema ) {
    if( !this[ name ] ) {
      this.ajvValidators[ name ] = requestPayloadSchema ? ajv.compile( requestPayloadSchema ) : ( data ) => true;

      this[ name ] = async ( requestPayload, id ) => {
        this.validateData( requestPayload, requestPayloadSchema, name );

        return this.request( { name, requestPayload, id } );
      };
    } else {
      throw Error( `Service property with name ${ name } already exists` );
    }
  }

  validateData( requestPayload, requestPayloadSchema, handlerName ) {
    const dataValidator = this.ajvValidators[ handlerName ];

    if( !dataValidator( requestPayload ) ) {
      const errorMessage = 'Got error while validating data with schema';
      throw new ValidationError( requestPayload, requestPayloadSchema, handlerName, dataValidator.errors, errorMessage );
    }

    return true;
  }

  onBeforeRequest( callback ) {
    this.setHook( 'beforeRequest', callback );
  }

  onResponseHandled( callback ) {
    this.setHook( 'responseHandled', callback );
  }

  onBeforeFetch( callback ) {
    this.fetcher.onBeforeFetch( callback );
  }
};
