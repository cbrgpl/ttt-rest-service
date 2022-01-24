const { Fetcher } = require( './fetcher' );
const { ajv } = require( './../helper/ajv' );

const { ValidationError } = require( './../error/validationError' );
const { HookClass } = require( './hookClass' );

const availableHooks = {
  beforeRequest: 'beforeRequest',
  responseHandled: 'responseHandled'
};

module.exports.Service = class extends HookClass {
  constructor( { apiModuleSchema, responseProcessor = null, name = null } ) {
    super( availableHooks );

    this.name = name;

    this.fetcher = new Fetcher( apiModuleSchema );
    this.responseProcessor = responseProcessor;

    this.ajvValidators = {}; // <handler, ajv-validator> pairs
  }

  async request( { handlerName, data = {}, id } ) {
    const requestArgs = this.callHook( availableHooks.beforeRequest, { handlerName, data, id } ) || arguments[ 0 ];
    const httpResponse = await this.fetcher.request( requestArgs );

    if( this.responseProcessor !== null ) {
      const handledResponse =  await this.responseProcessor.processResponse( httpResponse );

      this.callHook( availableHooks.responseHandled, { handledResponse } );
      return handledResponse;
    } else {
      return httpResponse;
    }
  }

  validateData( data, dataSchema, handlerName ) {
    const dataValidator = this.ajvValidators[ handlerName ];

    if( !dataValidator( data ) ) {
      const errorMessage = 'Got error while validating data with scheme';
      throw new ValidationError( data, dataSchema, handlerName, dataValidator.errors, errorMessage );
    }

    return true;
  }

  addHandler( { handlerName, dataSchema } ) {
    if( !this.handlerName ) {
      this.ajvValidators[ handlerName ] = dataSchema ? ajv.compile( dataSchema ) : ( data ) => true;

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

  onBeforeRequest( callback ) {
    this.setHook( availableHooks.beforeRequest, callback );
  }

  onResponseHandled( callback ) {
    this.setHook( availableHooks.responseHandled, callback );
  }

  onBeforeFetch( callback ) {
    this.fetcher.onBeforeFetch( callback );
  }
};
