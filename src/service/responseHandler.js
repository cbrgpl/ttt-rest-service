require( './../helpers/regExpLookbehind' )
const CONST = require( './../helpers/consts.js' )

async function parseData( httpResponse, dataType ) {
  switch ( dataType ) {
  case CONST.RESPONSE_TYPE.JSON:
    return await httpResponse.json()
  case CONST.RESPONSE_TYPE.MULTIPART_FORM_DATA:
    return await httpResponse.blob()
  case CONST.RESPONSE_TYPE.TEXT_PLAIN:
    return ( await httpResponse.text() ).replace( /"||'/g, '' )
  default:
    return null
  }
}

function defineReponseType( httpResponse ) {
  return httpResponse.headers.get( 'Content-Type' ).lookbehind( '^', /;.*/ )
}

module.exports = class ResponseHandler {
  // invalidStatuses[array of elem[array]]
  // elem{statuses[array], handler[fn] }
  constructor( invalidStatuses = [] ) {
    this._invalidStatuses = invalidStatuses
  }

  _getStatusGroupHandler( status ) {
    for( const statusGroup of this._invalidStatuses ) {
      if( statusGroup.statuses.includes( status ) ) {
        return statusGroup.handler
      }
    }

    return null
  }

  async checkResponse( httpResponse ) {
    const invalidStatusHandler = this._getStatusGroupHandler( httpResponse.status )

    if( invalidStatusHandler !== null ) {
      invalidStatusHandler( httpResponse )
    }

    const dataType = defineReponseType( httpResponse )
    const handledResponse = {
      data: await parseData( httpResponse, dataType ),
      httpResponse
    }

    return handledResponse
  }
}
