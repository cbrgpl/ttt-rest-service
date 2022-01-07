async function _fetch( url, settings, fetch ) {
  try {
    const response = await fetch( url, settings )
    return response
  } catch( error ) {
    console.error( 'An error occurred while executing the request' )
    console.log( error )
    return {}
  }
}

function _insertQueryParams( apiPath, queryParams ) {
  if( Object.keys( queryParams ).length === 0 ) {
    return apiPath
  }

  let url = apiPath + '?'

  for( const query in queryParams ) {
    url += `${ query }=${ queryParams[ query ] }&`
  }

  return url.slice( 0, -1 )
}

function _getResourceUrl( apiPath, resourceId ) {
  return apiPath.replace( '${resourceId}', resourceId )
}

function ckeckApiKey( apiKey, api ) {
  if( !apiKey ) {
    console.warn( 'apiKey value is not exists' )
  } else if( !api[ apiKey ] ) {
    console.warn( `api[apiKey] with ${ apiKey } is not exists ` )
  }
}

module.exports = class Fetcher {
  constructor( { api = {}, fetch = fetch  } ) {
    this._api = api

    // ! delete
    this._fetch = fetch
  }

  request( { apiKey, settings, queryParams = {}, resourceId = null } ) {
    ckeckApiKey( apiKey, this._api )

    const apiPath = this._api[ apiKey ]
    const url = resourceId ? _insertQueryParams( _getResourceUrl( apiPath, queryParams ) ) : _insertQueryParams( apiPath, queryParams )
    console.log( url )
    return _fetch( url, settings, this._fetch )
  }
}
