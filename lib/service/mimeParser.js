import { MimeError } from '../error/mimeError';

import { isFunction } from '../helper/isFunction';
import { NO_CONTENT_TYPE } from '../enum/consts';
import { lookbehind } from '../helper/lookbehind';

const noContentTypeHandler = () => null;

export class MimeParser {
  constructor( mimeTypes = [] ) {
    this.validateMimeParsers( mimeTypes );

    this.mimeTypes = new Map( mimeTypes );
    this.mimeTypes.set( NO_CONTENT_TYPE, noContentTypeHandler );
  }

  validateMimeParsers( mimeTypes ) {
    for( const mimeType of mimeTypes ) {
      if( !isFunction( mimeType[ 1 ] ) ) {
        throw TypeError( `MIME type parser for ${ mimeType[ 0 ] } must be type of function` );
      }
    }
  }

  parseResponseBody( response ) {
    const mimeType = this.defineMimeType( response );
    const mimeParser = this.getMimeParser( mimeType );

    return mimeParser( response );
  }

  defineMimeType( response ) {
    const headers = response.headers;

    if( headers ) {
      const contentType = headers.get( 'Content-Type' );
      return contentType !== null ? lookbehind( contentType, '^', /;.*/ ) : NO_CONTENT_TYPE;
    } else {
      throw TypeError( 'Response does not have headers property\nDo you sure you passed instance of Response?' );
    };
  }

  getMimeParser( responseMimeType ) {
    if( this.mimeTypes.has( responseMimeType ) ) {
      return this.mimeTypes.get( responseMimeType );
    } else {
      throw new MimeError( responseMimeType, `A MIME type equal to '${ responseMimeType }' is not expect\nMake sure u defined right MIME type key` );
    }
  }
};
