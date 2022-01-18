const { StatusError } = require( '../error/statusError' );
const { MimeTypeParser } = require( './mimeTypeParser' );

module.exports.ResponseProcessor = class  {
  constructor( mimeParserPairs, invalidStatuses = [] ) {
    this.invalidStatuses = invalidStatuses;
    this.mimeTypeParser = new MimeTypeParser( mimeParserPairs );
  }

  async validateResponseStatus( httpResponse ) {
    if( this.invalidStatuses.includes( httpResponse.status ) ) {
      throw new StatusError( httpResponse.status, httpResponse.url );
    }
  }

  async processResponse( httpResponse ) {
    this.validateResponseStatus( httpResponse );

    const parsedBody = await this.mimeTypeParser.parseResponseBody( httpResponse );

    const handledResponse = {
      parsedBody,
      httpResponse
    };

    return parsedBody !== null ? handledResponse : httpResponse;
  }



};
