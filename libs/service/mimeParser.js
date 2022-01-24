const { MimeError } = require( '../error/mimeError' );

const { isFunction } = require( '../helper/isFunction' );
const { NO_CONTENT_TYPE } = require( '../enum/consts' );
const { lookbehind } = require( '../helper/lookbehind' );

const noContentTypeHandler = () => null;

module.exports.MimeParser = class  {
  constructor( mimeParserPairs = [] ) {
    this.validateMimeParsers( mimeParserPairs );

    this.mimeParserPairs = new Map( mimeParserPairs );
    this.mimeParserPairs.set( NO_CONTENT_TYPE, noContentTypeHandler );
  }

  validateMimeParsers( mimeParserPairs ) {
    for( const mimeTypePair of mimeParserPairs ) {
      if( !isFunction( mimeTypePair[ 1 ] ) ) {
        throw TypeError( `MIME type parser for ${ mimeTypePair[ 0 ] } must be an function` );
      }
    }
  }

  getMimeParser( responseMimeType ) {
    if( this.mimeParserPairs.has( responseMimeType ) ) {
      return this.mimeParserPairs.get( responseMimeType );
    } else {
      throw new MimeError( responseMimeType, `A MIME type equal to '${ responseMimeType }' is not expect\nMake sure u defined right MIME type key` );
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
