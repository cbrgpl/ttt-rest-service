const { MimeTypeError } = require( '../error/mimeTypeError' );

const { isFunction } = require( '../helper/isFunction' );
const { NO_CONTENT_TYPE } = require( '../enum/consts' );
const { lookbehind } = require( '../helper/lookbehind' );

const noContentTypeHandler = () => null;

module.exports.MimeTypeParser = class  {
  constructor( mimeParserPairs = {} ) {
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
    const expectedMimeTypes = Object.keys( this.mimeParserPairs );

    if( expectedMimeTypes.includes( responseMimeType ) ) {
      return this.mimeParserPairs[ responseMimeType ];
    } else {
      throw new MimeTypeError( responseMimeType, `A MIME type equal to '${ responseMimeType }' is not expect\nMake sure u defined right MIME type key` );
    }
  }

  defineMimeType( httpResponse ) {
    const headers = httpResponse.headers;

    if( headers ) {
      const contentType = headers.get( 'Content-Type' );
      return contentType !== null ? lookbehind( contentType, '^', /;.*/ ) : NO_CONTENT_TYPE;
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
