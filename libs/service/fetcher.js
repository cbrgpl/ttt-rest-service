const ApiModule = require( './apiModule' );
const { isFunction } = require( '../helper/isFunction' );

const { defaultHook } = require( '../helper/defaultHook' );


module.exports = class Fetcher {
  constructor( apiModuleScheme = {} ) {
    this.apiModule = new ApiModule( apiModuleScheme );

    this.beforeFetch = defaultHook;
  }

  onBeforeFetch( callback ) {
    if( isFunction( callback ) ) {
      this.beforeFetch = callback;
    } else {
      throw TypeError( 'Passed \'callback\' argument value is not callable' );
    };
  }

  request( { endpointName, body = null, queryParams = {}, id } ) {
    const requestParams = this.apiModule.getRequestParams( {
      endpointName,
      body,
      queryParams,
      id
    } );

    this.beforeFetch( requestParams );

    return fetch( requestParams.url, requestParams.fetchParams );
  }
};
