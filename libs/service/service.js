const { ResponseProcessor } = require( './responseProcessor' );
const { Fetcher } = require( './fetcher' );

const { ValidationError } = require( './../error/validationError' );

const { ajv } = require( './../helper/ajv' );
const { defaultHook } = require( '../helper/defaultHook' );
const { isFunction } = require( './../helper/isFunction' );

module.exports.Service = class {
  constructor( { moduleScheme, responseProcessor = null, name = null } ) {
    this.name = name;

    this.fetcher = new Fetcher( moduleScheme );
    this.responseProcessor = responseProcessor;

    this.defaultBeforeRequest = function ( { handlerName, data, id } ) {
      return arguments[ 0 ];
    };

    this.responseHandledHook = defaultHook;
    this.beforeRequestHooks = {};
    this.validators = {}; // <handler, ajv-validator> pairs
  }

  async request( { handlerName, data = {}, id } ) {
    const beforeRequestHook = this.beforeRequestHooks[ handlerName ];
    const hookedArgs = beforeRequestHook( arguments[ 0 ] ) || arguments[ 0 ];

    const httpResponse = await this.fetcher.request( hookedArgs );

    if( this.responseProcessor !== null ) {
      const handledResponse =  await this.responseProcessor.processResponse( httpResponse );
      this.hooks.responseHandled( handledResponse );
      return handledResponse;
    } else {
      return httpResponse;
    }
  }

  validateData( data, dataSchema, handlerName ) {
    const dataValidator = this.validators[ handlerName ];

    if( !dataValidator( data ) ) {
      const errorMessage = 'Got error while validating data with scheme';
      throw new ValidationError( data, dataSchema, handlerName, dataValidator.errors, errorMessage );
    }

    return true;
  }

  addHandler( { handlerName, dataSchema } ) {
    if( !this.handlerName ) {
      this.beforeRequestHooks[ handlerName ] = this.defaultBeforeRequest;
      this.validators[ handlerName ] = dataSchema ? ajv.compile( dataSchema ) : ( data ) => true;

      this[ handlerName ] = async ( data, id ) => {
        this.validateData( data, dataSchema, handlerName );

        return this.request( {
          handlerName,
          data,
          id,
        } );
      };
    } else {
      throw Error( `Service property with name ${ handlerName } already exists` );
    }
  }

  setDefaultBeforeRequest( callback ) {
    if( isFunction( callback ) ) {
      this.defaultBeforeRequest = callback;
    } else {
      throw TypeError( 'Callback-hook must be an function' );
    }
  }

  onBeforeRequest( handlerName, callback ) {
    if( isFunction( callback ) ) {
      this.beforeRequestHooks[ handlerName ] = callback;
    } else {
      throw TypeError( 'Callback-hook must be an function' );
    }
  }

  onBeforeFetch( callback ) {
    this.fetcher.onBeforeFetch( callback );
  }

  onResponseHandled( callback ) {
    this.responseHandledHook = callback;
  }
};
