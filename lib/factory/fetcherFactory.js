import { RequestParams } from '../service/requestParams';
import { Fetcher } from '../service/fetcher';

export class FetcherFactory {
  getFetcher( apiModuleSchema ) {
    const requestMap = this.getRequestMap( apiModuleSchema );
    return new Fetcher( requestMap );
  }

  getRequestMap( apiModuleSchema ) {
    const requestMap = new Map();

    for( const requestMetadata of apiModuleSchema ) {
      const requestParams = new RequestParams( requestMetadata );
      const handlerName = requestMetadata.handler;

      requestMap.set( handlerName, requestParams );
    }

    return requestMap;
  }
};
