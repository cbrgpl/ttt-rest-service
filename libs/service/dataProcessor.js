const CONST = require( '../helpers/consts.js' )
const isObject = require( '../helpers/isObject.js' )

const _PROCESS_VARIANTS = {
  SEND: 'SEND_TYPE',
  GET: 'GET_TYPE'
}

function _getArgValidationObj ( argName, value, callback ) {
  return {
    value: value,
    validationCallback: callback,
    validateCallbackValues: value,
    error: `${ argName } is not valid with value ${ value }`
  }
}

function _generateValidationObj( args ) {
  const argsValidationObj = {}

  for( const argName in args ) {
    switch( argName ) {
    case 'dataType':
      argsValidationObj.dataType = _getArgValidationObj( 'dataType', { value: args.dataType, enumObj: CONST.RESPONSE_TYPE }, enumIncludesValue )
      continue

    case 'variant':
      argsValidationObj.variant = _getArgValidationObj( 'variant', { value: args.variant, enumObj: _PROCESS_VARIANTS }, enumIncludesValue )
      continue

    case 'callback':
      argsValidationObj.callback = _getArgValidationObj( 'callback', { callback: args.callback }, validateCallback )
      continue

    default:
      continue
    }
  }

  return argsValidationObj
}

const _validateArg = ( args, conditionCallback, error ) => {
  if( !conditionCallback( args ) ) {
    console.warn( error )
    return false
  }

  return true
}

const validateCallback = ( { callback } ) => typeof callback === 'function'
const enumIncludesValue = ( { enumObj, value } ) => Object.keys( enumObj ).some( ( enumKey ) => enumObj[ enumKey ] === value )

function _validateArgs( argsObject ) {
  let argsValid = {}

  for( const argKey in argsObject ) {
    argsValid[ argKey ] = true
    const argParams = argsObject[ argKey ]

    if( !_validateArg( argParams.validateCallbackValues, argParams.validationCallback, argParams.error ) ) {
      argsValid[ argKey ] = false
    }

  }

  return Object.keys( argsValid ).every( ( argKey ) => argsValid[ argKey ] )
}

module.exports = class DataProcessor {
  constructor() {
    this._processorFunctions = {}

    for( const  typeKey in CONST.RESPONSE_TYPE ) {
      const dataType = CONST.RESPONSE_TYPE[ typeKey ]
      this._processorFunctions[ dataType ] = {}

      for( const variantKey in _PROCESS_VARIANTS ) {
        const variant = _PROCESS_VARIANTS[ variantKey ]
        this._processorFunctions[ dataType ][ variant ] = []
      }
    }
  }

  static PROCESS_VARIANTS = _PROCESS_VARIANTS

  setProcessor( { dataType = CONST.RESPONSE_TYPE.JSON, variant, callback } ) {
    const validateObject = _generateValidationObj( { dataType, variant, callback } )
    const argsValidation = _validateArgs( validateObject )

    if( argsValidation ) {
      this._processorFunctions[ dataType ][ variant ].push( callback )
    }

  }

  processData( { data, dataType = CONST.RESPONSE_TYPE.JSON, variant } ) {
    const validateObject = _generateValidationObj( { dataType, variant } )
    const argsValidation = _validateArgs( validateObject )

    if( !argsValidation ) {
      return
    }

    if( !data ) {
      console.warn( '"data" value is not valid' )
      console.warn( data )
      return
    }

    let buffer = data

    for( const processor of this._processorFunctions[ dataType ][ _PROCESS_VARIANTS.SEND ] ) {
      buffer = processor( buffer )
      buffer = isObject( buffer ) ? buffer : data // if function does not return object
    }

    return buffer
  }
}
