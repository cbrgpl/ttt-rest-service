const { ApiModule } = require( './apiModule' );
const { isFunction } = require( '../helper/isFunction' );

const { defaultHook } = require( '../helper/defaultHook' );


module.exports.Fetcher = class  {
  constructor( apiModule = [] ) {
    this.apiModule = new ApiModule( apiModule );

    this.beforeFetch = defaultHook;
  }

  onBeforeFetch( callback ) {
    if( isFunction( callback ) ) {
      this.beforeFetch = callback;
    } else {
      throw TypeError( 'Callback-hook must be an function' );
    };
  }

  request( { handlerName, data = {}, id } ) {
    const requestParams = this.apiModule.getRequestParams( handlerName, data, id );

    // allows cancel a fetch
    if( this.beforeFetch( requestParams ) ) {
      return;
    }

    return fetch( requestParams.url, requestParams.fetchParams );
  }
};
