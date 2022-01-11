const ApiEndpoint = require( './apiEndpoint' );
const EndpointError = require( '../error/endpointError' );

module.exports = class ApiModule {
  constructor( moduleScheme ) {
    this.apiEndpoints = {};

    for( const endpointKey in moduleScheme ) {
      this.apiEndpoints[ endpointKey ] = new ApiEndpoint( endpointKey, moduleScheme[ endpointKey ] );
    }
  }

  checkEndpointExist( endpointName ) {
    const endpointArray = Object.keys( this.apiEndpoints );

    if( !endpointArray.includes( endpointName ) ) {
      throw new EndpointError( endpointName, `Endpoint with name ${ endpointName } is not exists` );
    }
  }

  getRequestParams( { endpointName, queryParams, body, id } ) {
    this.checkEndpointExist( endpointName );

    const endpoint = this.apiEndpoints[ endpointName ];

    return endpoint.getRequestParams( queryParams, body, id );
  }
};
