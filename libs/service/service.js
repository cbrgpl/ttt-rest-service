const { ajv } = require( './../helper/ajv' );

const { ValidationError } = require( './../error/validationError' );
const { Hookable } = require( './Hookable' );

const mapableArrayOfHooks = Hookable.getConstructorMapableArray( [
  'beforeRequest',
  'responseHandled'
] );


module.exports.Service = class extends Hookable {
  constructor( fetcher = null, responseProcessor = null, name = null ) {
    super( mapableArrayOfHooks );

    this.name = name;

    this.fetcher = fetcher;
    this.responseProcessor = responseProcessor;

    this.ajvValidators = {}; // <handler, ajv-validator> pairs
  }

  async request( { handlerName, data = {}, id } ) {
    const requestArgs = this.callHook( 'beforeRequest', { handlerName, data, id } ) || arguments[ 0 ];
    const httpResponse = await this.fetcher.request( requestArgs );

    if( this.responseProcessor !== null ) {
      const handledResponse =  await this.responseProcessor.processResponse( httpResponse );

      this.callHook( 'responseHandled', { handledResponse } );
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

  addHandler( handlerName, dataSchema ) {
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
    this.setHook( 'beforeRequest', callback );
  }

  onResponseHandled( callback ) {
    this.setHook( 'responseHandled', callback );
  }

  onBeforeFetch( callback ) {
    this.fetcher.onBeforeFetch( callback );
  }
};
