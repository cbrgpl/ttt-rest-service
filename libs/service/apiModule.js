const { RequestParametrs } = require( './requestParametrs' );

module.exports.ApiModule = class {
  constructor( moduleSchema ) {
    this.parametrsOfRequests = {};

    for( const requestMetadata of moduleSchema ) {
      const endpointName = requestMetadata.handler;
      this.parametrsOfRequests[ endpointName ] = new RequestParametrs( requestMetadata );
    }
  }


  getRequestParams( endpointName,  ...params ) {
    const endpoint = this.parametrsOfRequests[ endpointName ];

    return endpoint.getRequestParams( ...params );
  }
};
