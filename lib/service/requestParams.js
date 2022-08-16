import { METHOD_TYPES } from '../enum/methodTypes';

const queryIdTempalate = '{{id}}';

export class RequestParams {
  constructor( requestSchema ) {
    this.requestSchema = requestSchema;
  }

  getDefaultRequestParams() {
    return {
      url: null,
      fetchParams: {
        method: this.requestSchema.method,
        headers: this.requestSchema.headers,
      },
      security: {
        secure: this.requestSchema.secure,
        roles: this.requestSchema.roles,
      }
    };
  }

  getRequestParams( payload, id ) {
    const defaultRequestParams = this.getDefaultRequestParams();
    const methodType = this.defineMethodType( defaultRequestParams.fetchParams.method );
    defaultRequestParams.url = this.insertUrlId( id );

    if( methodType === METHOD_TYPES.USE_BODY.NAME ) {
      return this.prepareUseBodyRequest( defaultRequestParams, payload );
    } else {
      return this.prepareUseQueryParamsRequest( defaultRequestParams, payload );
    }
  }

  prepareUseBodyRequest( defaultRequestParams, payload ) {
    defaultRequestParams.fetchParams.body = payload;

    return defaultRequestParams;
  }

  prepareUseQueryParamsRequest( defaultRequestParams, payload ) {
    defaultRequestParams.url = this.insertQueryParams( defaultRequestParams.url, payload );

    return defaultRequestParams;
  }

  insertQueryParams( url, queryParams ) {
    let paramsUrl = url + '?';

    for( const param in queryParams ) {
      paramsUrl += `${ param }=${ queryParams[ param ] }&`;
    }

    return paramsUrl.slice( 0, -1 );
  }

  defineMethodType( method ) {
    if( METHOD_TYPES.USE_BODY.METHODS.includes( method ) ) {
      return METHOD_TYPES.USE_BODY.NAME;
    } else {
      return METHOD_TYPES.USE_QUERY_PARAMS.NAME;
    };
  }

  insertUrlId( id ) {
    return this.requestSchema.url.replace( queryIdTempalate, id );
  }

};
