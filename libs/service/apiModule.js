const { ApiEndpoint } = require( './apiEndpoint' );

module.exports.ApiModule = class {
  constructor( moduleScheme ) {
    this.apiEndpoints = {};

    for( const endpointMetadata of moduleScheme ) {
      const endpointName = endpointMetadata.handler;
      this.apiEndpoints[ endpointName ] = new ApiEndpoint( endpointMetadata );
    }
  }


  getRequestParams( endpointName,  ...params ) {
    const endpoint = this.apiEndpoints[ endpointName ];

    return endpoint.getRequestParams( ...params );
  }
};
