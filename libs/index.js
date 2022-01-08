require( 'dotenv' ).config()

const CONST = require( './helpers/consts' )

const Fetcher = require( './service/fetcher' )
const DataProcessor = require( './service/dataProcessor' )
const ResponseHandler = require( './service/responseHandler' )

const CamelKebabTranslator = require( './utils/camelKebabTranslator' )

const API_URL = process.env.TEST_API

const api1 = {
  login: API_URL + '/auth/login/',
  getProxy: API_URL + '/proxy/'
}

let tokens = {
  auth_token: null,
  websocket_token: null,
}

const requestData = {
  login: {
    username: 'admin',
    password: 'password'
  }
}

async function auth( service ) {
  const requestSettings = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify( requestData[ 'login' ] )
  }

  const request = await service.request( { apiKey: 'login', settings: requestSettings } )

  const responseTokens = await request.json()
  tokens = { ...responseTokens }
}

async function getProxy( service ) {
  const requestSettings = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Token ' + tokens.auth_token
    },
  }

  const query = {
    testQuery: 'testParams',
  }

  const invalidStatusesHandlerList = [
    {
      statuses: [ 200 ],
      handler( httpResponse ) {
        console.log( 'handler.callback', httpResponse )
      }
    }
  ]

  const responseHandler = new ResponseHandler( invalidStatusesHandlerList )

  const request = await service.request( { apiKey: 'getProxy', settings: requestSettings, queryParams: query } )
  const response = await responseHandler.checkResponse( request )
}


async function requesting() {
  const fetch = ( await import( 'node-fetch' ) ).default
  const fetcher = new Fetcher( { api: api1, fetch } )

  await auth( fetcher )
  await getProxy( fetcher )

}

requesting()



// test dataProcessor
const dataProcessor = new DataProcessor()

const dataObject = {
  a: '0',
  b: '1',
  c: '2'
}

const testDataProcessorFunctions = {
  toBackend: [
    ( dataObject ) => dataObject.a += '10',
    ( dataObject ) => dataObject.b += '20',
    ( dataObject ) => dataObject.c += '30'
  ],
  toFrontend: [
    ( dataObject ) => dataObject.a = 'q',
    ( dataObject ) => dataObject.b = 'w',
    ( dataObject ) => dataObject.c = 'c'
  ]
}

for( const processor of testDataProcessorFunctions.toBackend ) {
  dataProcessor.setProcessor( {
    variant: DataProcessor.PROCESS_VARIANTS.SEND,
    callback: processor,
  } )
}

for( const processor of testDataProcessorFunctions.toFrontend ) {
  dataProcessor.setProcessor( {
    variant: DataProcessor.PROCESS_VARIANTS.GET,
    callback: processor,
  } )
}

dataProcessor.processData( {
  data: dataObject,
  variant: DataProcessor.PROCESS_VARIANTS.SEND
} )

console.log( dataObject )

console.log( 'd' )

// [-----------------------------------------------------------------------------------------------------------------]
const kebabObj = {
  kebab_kamel1: 'gee',
  kebab_array: [ { inner_kebab: '' }, { inner_kebab2: 1 } ],
  kebab_kamel_undefined: undefined,
  kebab_kamel_null: null,
}

const camelObj = {
  kebabKamel2: 'qww',
  donKoe: [ { lodLaw: 1 }, { getGot: 2 } ],
  camelUndefined: undefined,
  camelNull: null
}


const kebabArr = [
  {
    prop_dso1: 1
  },
  {
    prop_dso1: 2
  },
  {
    prop_dso1: 3
  },
  {
    prop_dso1: 4
  }
]

const camelArr = [
  {
    propDso1: 5
  },
  {
    propDso1: 6
  },
  {
    propDso1: 7
  },
  {
    propDso1: 8
  },
]

const translatedKebab = CamelKebabTranslator.translate( {
  value: kebabArr,
  mode: CamelKebabTranslator.MODS.KEBAB_CAMEL
} )

const translatedCamel = CamelKebabTranslator.translate( {
  value: camelArr,
  mode: CamelKebabTranslator.MODS.CAMEL_KEBAB
} )

console.log( translatedKebab )
console.log( translatedCamel )

console.log( 'a' )
