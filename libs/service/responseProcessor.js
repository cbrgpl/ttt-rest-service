const { StatusError } = require( './../error/statusError' );

module.exports.ResponseProcessor = class  {
  constructor( mimeParser, invalidStatuses = [] ) {
    this.invalidStatuses = invalidStatuses;
    this.mimeParser = mimeParser;
  }

  async validateResponseStatus( httpResponse ) {
    if( this.invalidStatuses.includes( httpResponse.status ) ) {
      throw new StatusError( httpResponse.status, httpResponse.url );
    }
  }

  async processResponse( httpResponse ) {
    this.validateResponseStatus( httpResponse );

    const parsedBody = await this.mimeParser.parseResponseBody( httpResponse );

    const handledResponse = {
      parsedBody,
      httpResponse
    };

    return parsedBody !== null ? handledResponse : httpResponse;
  }



};
