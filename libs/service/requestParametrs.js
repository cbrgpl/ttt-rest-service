const { NO_CONTENT_TYPE } = require( './../enum/consts' );
const { METHOD_TYPES } = require( './../enum/methodTypes' );
const queryIdTempalate = '{{id}}';

module.exports.RequestParametrs = class {
  constructor( requestMetadata ) {
    this.requestMetadata = requestMetadata;
  }

  getDefaultRequestParams() {
    return {
      url: null,
      fetchParams: {
        body: null,
        method: this.requestMetadata.method,
        headers: this.requestMetadata.headers,
      },
      security: {
        secure: this.requestMetadata.secure,
        roles: this.requestMetadata.roles,
      }
    };
  }

  getRequestParams( data, id ) {
    const defaultRequestParams = this.getDefaultRequestParams();
    const methodType = this.defineMethodType( defaultRequestParams.fetchParams.method );

    if( methodType === METHOD_TYPES.USE_BODY.NAME ) {
      return this.prepareUseBodyRequest( defaultRequestParams, data );
    } else {
      return this.prepareUseQueryParamsRequest( defaultRequestParams, data, id );
    }
  }

  prepareUseBodyRequest( defaultRequestParams, data ) {
    defaultRequestParams.url = this.requestMetadata.path;
    defaultRequestParams.fetchParams.body = data;

    return defaultRequestParams;
  }

  prepareUseQueryParamsRequest( defaultRequestParams, data, id ) {
    defaultRequestParams.url = this.insertUrlId( id );
    defaultRequestParams.url = this.insertQueryParams( defaultRequestParams.url, data );

    return defaultRequestParams;
  }

  defineMethodType( method ) {
    if( METHOD_TYPES.USE_BODY.METHODS.includes( method ) ) {
      return METHOD_TYPES.USE_BODY.NAME;
    } else {
      return METHOD_TYPES.USE_QUERY_PARAMS.NAME;
    };
  }

  insertUrlId( id ) {
    return this.requestMetadata.path.replace( queryIdTempalate, id );
  }

  insertQueryParams( url, queryParams ) {
    let paramsUrl = url + '?';

    for( const param in queryParams ) {
      paramsUrl += `${ param }=${ queryParams[ param ] }&`;
    }

    return paramsUrl.slice( 0, -1 );
  }

};
