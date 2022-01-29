const { RequestParameters } = require( './../service/requestParameters' );
const { Fetcher } = require( './../service/fetcher' );

module.exports.FetcherFactory = class {

  getFetcher( apiModuleSchema ) {
    const requestMap = this.getRequestMap( apiModuleSchema );
    return new Fetcher( requestMap );
  }

  getRequestMap( apiModuleSchema ) {
    const requestMap = new Map();

    for( const requestMetadata of apiModuleSchema ) {
      const requestParameters = new RequestParameters( requestMetadata );
      const handlerName = requestMetadata.handler;

      requestMap.set( handlerName, requestParameters );
    }

    return requestMap;
  }
};
