const isObject = require( './../helpers/isObject' )

const MODS = {
  KEBAB_CAMEL: 'KC',
  CAMEL_KEBAB: 'CK'
}

const _TYPES = {
  ARRAY: 'ARRAY',
  OBJECT: 'OBJECT',
  NOT_DEFINED: 'NOT_DEFINED'
}

const _TRANSLATORS = {
  toKebab ( key ) {
    let kebabedKey = key

    const upperCaseSymbols = RegExp( /[A-Z]/g )
    const matches = [ ...key.matchAll( upperCaseSymbols ) ]
    const matchesLastIndex = matches.length - 1

    for ( let i = matchesLastIndex; i >= 0; --i ) {
      const underlineIndex = matches[ i ].index

      kebabedKey = kebabedKey.slice( 0, underlineIndex ) + '_' + kebabedKey[ underlineIndex ].toLowerCase() + kebabedKey.slice( underlineIndex + 1, kebabedKey.length )
    }

    return kebabedKey
  },
  toCamel ( key ) {
    let cameledKey = key

    const underlineReg = RegExp( '_', 'g' )
    const matches = [ ...key.matchAll( underlineReg ) ]
    const matchesLastIndex = matches.length - 1

    for ( let i = matchesLastIndex; i >= 0; --i ) {
      const underlineIndex = matches[ i ].index

      cameledKey = cameledKey.slice( 0, underlineIndex ) + cameledKey[ underlineIndex + 1 ].toUpperCase() + cameledKey.slice( underlineIndex + 2, cameledKey.length )
    }

    return cameledKey
  }
}

function defineType( data ) {
  if( Array.isArray( data ) ) {
    return _TYPES.ARRAY
  } else if( isObject( data ) ) {
    return _TYPES.OBJECT
  } else {
    return _TYPES.NOT_DEFINED
  }
}

function _translateArray( { arr, mode } ) {
  const translatedArray = []

  for( const arrElem of arr ) {
    if( isObject( arrElem ) ) {
      translatedArray.push( _translateObject( { obj: arrElem, mode } ) )
    } else {translatedArray.push( arrElem )}
  }

  return translatedArray
}

function _applyTranslator( { str, mode } ) {
  switch( mode ) {
  case MODS.CAMEL_KEBAB:
    return _TRANSLATORS.toKebab( str )
  case MODS.KEBAB_CAMEL:
    return _TRANSLATORS.toCamel( str )
  }
}

function _translateObject( { obj, mode } ) {
  const translatedObject = {}

  for( const prop in obj ) {
    const value = obj[ prop ]
    let translatedVal = null

    if( isObject( value ) ) {
      translatedVal = _translateObject( { obj: value, mode } )
    } else if( Array.isArray( value ) ) {
      translatedVal = _translateArray( { arr: value, mode } )
    } else {
      translatedVal = value
    }

    const translatedKey = _applyTranslator( { str: prop, mode } )
    translatedObject[ translatedKey ] = translatedVal
  }

  return translatedObject
}

module.exports = class CamelKebabTranslator {
  static MODS = MODS

  static translate( { value, mode } ) {
    if( !Object.keys( MODS ).some( ( modeKey ) => MODS[ modeKey ] !== mode ) ) {
      console.warn( `invalid mode with value ${ mode }` )
      return value
    }

    const dataType = defineType( value )

    if( dataType === _TYPES.ARRAY ) {
      return _translateArray( {
        arr: value,
        mode,
      } )
    } else if ( dataType === _TYPES.OBJECT ) {
      return _translateObject( {
        obj: value,
        mode,
      } )
    } else {
      console.warn( `mode ${ mode } is not valid` )
      return obj
    }
  }
}
