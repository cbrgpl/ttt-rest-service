const MimeTypeError = require( '../error/mimeTypeError' );

const { isFunction } = require( '../helper/isFunction' );
const { NO_CONTENT_TYPE } = require( '../helper/consts' );
const { lookbehindAnalog } = require( '../helper/lookbehindAnalog' );

const noContentTypeHandler = () => null;

module.exports = class MimeTypeParser {
  constructor( mimeParserPairs ) {
    this.validateMimeParsers( mimeParserPairs );

    this.mimeParserPairs = mimeParserPairs;
    this.mimeParserPairs[ NO_CONTENT_TYPE ] = noContentTypeHandler;
  }

  validateMimeParsers( mimeParserPairs ) {
    for( const mimeType in mimeParserPairs ) {
      if( !isFunction( mimeParserPairs[ mimeType ] ) ) {
        throw TypeError( 'MIME type parser must be an function' );
      }
    }
  }

  getMimeParser( responseMimeType ) {
    const expectedMimeType = Object.keys( this.mimeParserPairs );

    if( expectedMimeType.includes( responseMimeType ) ) {
      return this.mimeParserPairs[ responseMimeType ];
    } else {
      throw new MimeTypeError( responseMimeType, `A MIME type equal to '${ responseMimeType }' is not expect\nMake sure u defined right MIME type key` );
    }
  }

  defineMimeType( httpResponse ) {
    const headers = httpResponse.headers;

    if( headers ) {
      const contentType = headers.get( 'Content-Type' );
      return contentType !== null ? lookbehindAnalog( contentType, '^', /;.*/ ) : NO_CONTENT_TYPE;
    } else {
      throw TypeError( 'httpResponse argument does not have headers property\nDo you sure you passed instance of Response?' );
    };
  }

  parseResponseBody( httpResponse ) {
    const mimeType = this.defineMimeType( httpResponse );
    const mimeParser = this.getMimeParser( mimeType );

    return mimeParser( httpResponse );
  }
};
