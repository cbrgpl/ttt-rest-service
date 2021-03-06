const { Hookable } = require( './hookable' );
const { defaultHook } = require( './../helper/defaultHook' );
const mapableArrayOfHooks =  [
  [ 'beforeFetch', defaultHook ]
];

module.exports.Fetcher = class extends Hookable {
  constructor( requestMap ) {
    super( mapableArrayOfHooks );

    this.requestMap = requestMap;
    this.setHook( 'beforeFetch', () => false );
  }

  onBeforeFetch( callback ) {
    this.setHook( 'beforeFetch', callback );
  }

  request( { handlerName, data = {}, id } ) {
    if( !this.requestMap.has( handlerName ) ) {
      throw Error( `Request parameters for handler with name ${ handlerName } are not exists` );
    }

    const requestParameters = this.requestMap.get( handlerName );
    const recievedRequestParameters = requestParameters.getRequestParams( data, id );

    const fetchCanceled = this.callHook( 'beforeFetch', recievedRequestParameters );
    if( fetchCanceled ) {
      return;
    }

    return fetch( recievedRequestParameters.url, recievedRequestParameters.fetchParams );
  }
};
