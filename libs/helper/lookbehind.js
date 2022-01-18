// regexp lookbehind analog
module.exports.lookbehind = ( value, keyword, unnecesarryPart ) => {
  if( typeof value !== 'string' ) {
    throw TypeError( 'Value must be type of \'string\'' );
  }

  // find keyword and all symbols after
  const regexp = new RegExp( `(?:${ keyword }).*($||&)` );
  const matches = value.match( regexp );

  const match = matches ? matches[ 0 ] : '';

  if ( Array.isArray( unnecesarryPart ) ) {
    return unnecesarryPart.reduce( ( resultValue, part ) => resultValue.replace( part, '' ), match );
  } else {
    return match.replace( unnecesarryPart, '' );
  }
};
