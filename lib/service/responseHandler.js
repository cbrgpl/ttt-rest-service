import { StatusError } from '../error/statusError';

export class ResponseHandler {
  constructor( mimeParser, invalidStatuses = [] ) {
    this.invalidStatuses = invalidStatuses;
    this.mimeParser = mimeParser;
  }

  validateResponseStatus( httpResponse ) {
    if( this.invalidStatuses.includes( httpResponse.status ) ) {
      throw new StatusError( httpResponse.status, httpResponse.url );
    }
  }

  async processResponse( response ) {
    this.validateResponseStatus( response );

    const body = await this.mimeParser.parseResponseBody( response );

    const responseWrapper = {
      body,
      response,
    };

    return responseWrapper;
  }



};
