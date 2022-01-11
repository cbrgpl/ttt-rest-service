const EndpointError = require( '../error/endpointError' );

const schemeKeyTypes = {
  path: 'string',
  fetchParams: 'object',
  queryParams: 'object',
  body: null,
  id: null
};

module.exports = class ApiEndpoint {
  constructor( endpointName, endpointScheme ) {
    this.endpointName = endpointName;
    this.validateEndpointScheme( endpointScheme );

    this.endpointScheme = endpointScheme;
  }

  validateEndpointScheme( endpointScheme ) {
    for( const schemeKey in endpointScheme ) {
      if( schemeKeyTypes[ schemeKey ] !== null && !schemeKeyTypes[ schemeKey ] ) {
        throw new EndpointError( this.endpointName, `The ${ schemeKey } is not valid scheme key` );
      }

      if( typeof endpointScheme[ schemeKey ] !== schemeKeyTypes[ schemeKey ] && endpointScheme[ schemeKey ] !== schemeKeyTypes[ schemeKey ] ) {
        throw new EndpointError( this.endpointName, `The ${ schemeKey } key of the endpoint scheme does not match the expected type or value` );
      }
    }
  }

  getRequestParams( queryParams, body, id ) {
    const requestParams = {
      url: this.getUrl( queryParams, id ),
      fetchParams: {
        ...this.endpointScheme.fetchParams,
      }
    };

    if( this.endpointScheme.body === null ) {
      requestParams.fetchParams.body = body;
    }

    return requestParams;
  }

  getUrl( queryParams, id ) {
    const url = this.endpointScheme.path.replace( '{{id}}', id );

    return this.endpointScheme.queryParams === null ? this.insertQueryParams( url, queryParams ) : url;
  }

  insertQueryParams( path, queryParams ) {
    let url = path + '?';

    for( const param in queryParams ) {
      url += `${ param }=${ queryParams[ param ] }&`;
    }

    return url.slice( 0, -1 );
  }

};
