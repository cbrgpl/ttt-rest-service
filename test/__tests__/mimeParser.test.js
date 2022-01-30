const { MimeParser } = require( './../../libs/service/mimeParser' );
const { MimeError } = require( './../../libs/error/mimeError' );
const { NO_CONTENT_TYPE } = require( './../../libs/enum/consts' );
const { getFunctionCaller, getFunctionResult } = require( './../__utils__' );

const mimeParserPairs = [
  [ 'application/json', ( httpResponse ) => 'application/json ' + httpResponse.data ]
];

const getMimeParser = ( mimeParserPairs ) => {
  return new MimeParser( mimeParserPairs );
};

test( 'Mime Parser - validateMimeParsers( validPairs )', () => {
  expect( getFunctionResult( () => {
    const mimeParser = getMimeParser( mimeParserPairs );
    const testMimeParserPairs = [
      [ 'app/json', () => true ]
    ];

    mimeParser.validateMimeParsers( testMimeParserPairs );
    return true;
  } ) ).toBeTruthy();
} );

test( 'Mime Parser - validateMimeParsers( invalidPairs )', () => {
  expect( getFunctionCaller( () => {
    const mimeParser = getMimeParser( mimeParserPairs );
    const testMimeParserPairs = [
      [ 'app/json', 'there should be a function' ]
    ];

    mimeParser.validateMimeParsers( testMimeParserPairs );
  } ) ).toThrow( 'MIME type parser for app/json must be an function' );
} );

test( 'Mime Parser - getMimeParser( existMimeType )', () => {
  expect( getFunctionResult( () => {
    const mimeParser = getMimeParser( mimeParserPairs );

    return mimeParser.getMimeParser( 'application/json' );
  } ) ).toBe( mimeParserPairs[ 0 ][ 1 ] );
} );

test( 'Mime Parser - getMimeParser( notExistMimeType )', () => {
  expect( getFunctionCaller( () => {
    const mimeParser = getMimeParser( mimeParserPairs );

    return mimeParser.getMimeParser( 'not_exist_mime_type' );
  } ) ).toThrow( MimeError );
} );

test( 'Mime Parser - defineMimeType( existHeadersObject )', () => {
  expect( getFunctionResult( () =>{
    const mimeParser = getMimeParser( mimeParserPairs );
    const fakeHttpResponse = {
      headers: {
        get() {
          return 'application/json; UTF-8';
        }
      }
    };

    return mimeParser.defineMimeType( fakeHttpResponse );
  } ) ).toEqual( 'application/json' );
} );

test( 'Mime Parser - defineMimeType( existHeadersObject ); Content-Type: null', () => {
  expect( getFunctionResult( () =>{
    const mimeParser = getMimeParser( mimeParserPairs );
    const fakeHttpResponse = {
      headers: {
        get() {
          return null;
        }
      }
    };

    return mimeParser.defineMimeType( fakeHttpResponse );
  } ) ).toEqual( NO_CONTENT_TYPE );
} );

test( 'Mime Parser - defineMimeType( notExistHeaderObject )', () => {
  expect( getFunctionCaller( () => {
    const mimeParser = getMimeParser( mimeParserPairs );
    const fakeHttpResponse = {};

    return mimeParser.defineMimeType( fakeHttpResponse );
  } ) ).toThrow( 'httpResponse argument does not have headers property\nDo you sure you passed instance of Response?' );
} );


test( 'Mime Parser - parseResponseBody', () => {
  expect( getFunctionResult( () => {
    const mimeParser = getMimeParser( mimeParserPairs );
    const fakeHttpResponse = {
      headers: {
        get() {
          return 'application/json';
        }
      },
      data: 'fakeHttpResponseData'
    };

    return mimeParser.parseResponseBody( fakeHttpResponse );
  } ) ).toEqual( 'application/json fakeHttpResponseData' );
} );
