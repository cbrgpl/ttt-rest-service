# rest-service

JS Library which gives functionallity to create services for client-server communication with REST style

Library provides:

    - default Service
    - Composite classes:
        - Fetcher
        - ResponseProcessor
        - MimeParser
    - Factories:
        - FetcherFactory
        - ServiceFactory

Use composite classes to create your own service if default Service does not fulfill the needs
<br><br><br><br>




# Installation

`npm i --save rest-service`
<br><br><br><br>




# Getting Started
```js
```
<br><br><br><br>




# Fetcher and API Modules Metadata
<p>
Fetcher binds to the API Module metadata<br>
API Module metadata is array of object which describe endpoints<br>
Describe send data of endpoints with JSON Schema<br>
</p>

### API Module structure:

```js
const authApiModule = [
    {
        // endpoint1
    },
    {
        // endpoint2
    },
]
```
### Endpoint structure:

    - method[string]
        request method
    - url[string]
        request url. There is posibility to insert ID into url,
        use ".../image/delete/{{id}}/"
        to get ".../image/delete/id_102/"
    - secure[boolean]
        help variable
    - roles[array]
        help variable
    - handler[string]
        name of the class method that will be generated
    - headers[object]
        request headers
    - schema[object]
        JSON schema of the data send by the request

### ApiModuleExample:

```js
    const authApiModule = [
    {
      method: 'POST',
      url: '/auth/login',
      secure: false,
      handler: 'login',
      roles: [],
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Credentials: 'include'
      },
      schema: {
        type: 'object',
        required: [ 'username', 'password' ],
        properties: {
          username: {
            type: 'string',
            minLength: 3
          },
          password: {
            type: 'string',
            minLength: 6
          }
        }
      },

    },
    {
      method: 'GET',
      url: '/auth/logout/{{id}}',
      secure: true,
      handler: 'logout',
      roles: [ 'user' ],
      headers: {
        Accept: 'application/json',
        Credentials: 'include'
      },
      schema: {
        // another JSON Schema
      },
    },
  ]
```
<br><br><br><br>

# Example of usage
<br><br>

## MimeParser && ResponseProcessor:
```js
const { MimeParser, ResponseProcessor } = require("rest-service")

const mimeParserPairs = [
    [ 'application/json', ( httpResponse ) => httpResponse.json() ]
]
const mimeParser = new MimeParser( mimeParserPairs )
const responseProcessor = new ResponseProcessor( mimeParser )

async function example() {
    const request = await fetch( 'some-url.com/get-instance' )
    const processedResponse = await responseProcessor.processResponse( request )
}

example()
```
<br>

## Fetcher
```js
const { FetcherFactory } = require('rest-service')

const authModule = [
  {
    method: 'POST',
    url: '/auth/login',
    secure: false,
    handler: 'login',
    roles: [],
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    schema: {
      type: 'object',
      required: [ 'username', 'password' ],
      properties: {
        username: {
          type: 'string',
          minLength: 3
        },
        password: {
          type: 'string',
          minLength: 6
        }
      },
    },
  },
];

const fetcherFactory = new FetcherFactory()
const fetcher = fetcherFactory.getFetcher(authModule)
const authToken = localStorage.get('authToken')

fetcher.onBeforeRequest(( requestParameters ) => {
    if(requestParameters.secure && authToken === null) {
        return true // prevent fetch
    } else {
        requestParameters.fetchParams.headers.Authorization = `Token ${ authToken }`
    }
})

async function example() {
    const sendData = {
        username: 'username',
        password: 'strong_password'
    }
    const request = await fetcher.request({ handlerName: 'login', data: sendData })
}

example()
```
<br>

## Service

```js
const { Service, fetcherFactory, mimeParser, responseProcessor } = require('rest-service')

const authModule = [
  {
    method: 'POST',
    url: '/auth/login',
    secure: false,
    handler: 'login',
    roles: [],
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    schema: {
      type: 'object',
      required: [ 'username', 'password' ],
      properties: {
        username: {
          type: 'string',
          minLength: 3
        },
        password: {
          type: 'string',
          minLength: 6
        }
      },
    },
  },
];

const fetcherFactory = new FetcherFactory();
const fetcher = fetcherFactory.getFetcher( authModule );

const mimeParserPairs = [
    [ 'application/json', ( httpResponse ) => httpResponse.json() ]
];
const mimeParser = new MimeParser( mimeParserPairs );
const responseProcessor = new ResponseProcessor( mimeParser );

const service = new Service(fetcher, responseProcessor)

service.onBeforeRequest(({ handlerName, data, id}) => {
    data.processedInBeforeRequest = true
    return {
        handlerName,
        data,
        id
    }
})

service.onResponseHandled(({ handledResponse }) => {
    handledResponse.parsedBody.processedInHook = true
})

async function exampleWithRequest() {
    const request = await service.request({
        handlerName: 'login',
        data: {
            username: 'username1',
            password: 'very_very_strong'
        }
    })
}

async function exampleWithSpecifiedHandler() {
    service.addHandler('login', authModule.schema)
    service.login({
        username: 'username1',
        password: 'very_weak_password'
    })
}

```

## ServiceFactory

```js
const { ServiceFactory, FetcherFactory, MimeParser, ResponseProcessor } = require('rest-service')

const API = {
    auth: [
        {
            method: 'POST',
            url: 'url.com/login/',
            secure: false,
            handlerName: 'login',
            roles: [],
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            schema: {
                //...
            }
        }
    ],
    user: [
        {
            method: 'GET',
            url: 'url.com/user/{{id}}',
            secure: true,
            handlerName: 'getUser',
            roles: [],
            headers: {
                Accept: 'application/json'
            },
            schema: {
                // ...
            }
        }
    ]
}

const fetcherFactory = new FetcherFactory();

const mimeParserPairs = [
    [ 'application/json', ( httpResponse ) => httpResponse.json() ]
];
const mimeParser = new MimeParser( mimeParserPairs );
const responseProcessor = new ResponseProcessor( mimeParser );

const serviceFactory = new ServiceFactory( fetcherFactory, responseProcessor );
const services = serviceFactory.generateServices( API )

const authService = services.authService
const userService = services.userService

authService.login({
    username: 'username1',
    password: 'password1'
})

const userId = 'user_id_12343'
userService.getUser({
    allInformation: true
}, userId)

```
<br><br><br><br>




# Library API

## **FetcherFactory**
<br>

### getFetcher( apiModuleSchema )

apiModuleStructure:

```js
const anApiModule = [
  {
    method: 'POST',
    url: 'url.com/login/',
    secure: false,
    handlerName: 'login',
    roles: [],
    headers: {
     // ...
    },
    schema: {
      //...
    }
  },
  {
    // endpoint 2
    // ...
  }
]
```

*Schema in endpoint metadata **MUST BE IN JSON SCHEMA FORMAT***

<br><br><br>



## **Fetcher**
<br>

### onBeforeFetch( callback )
| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| callback | function | () => false | The function which will be called as a hook |

**If you want prevent fetch execution, then your callback should return true**

<br><br>

### request( { handlerName, data = {}, id } )

| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| handlerName | string | undefined | request name |
| data | object | {} | request payload |
| id | string | undefined | url id |

If there is no {{id}} template in metadata url, **id will not be inserted**

<br><br><br>



## **ResponseProcessor**
<br>

### constructor( mimeParser, invalidStatuses )

| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| mimeParser | MimeParser | undefined | Helper class for parsing response body |
| invalidStatuses | array | [] | Array of statuses that will be considered invalid |

<br><br>


### processResponse( httpResponse )

| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| httpResponse | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | undefined | Response that will be processed |


If response contains body functino returns,

```js
{
    parsedBody,
    httpResponse,
}
```

else returns passed `httpResponse`

<br><br><br>



## **MimeParser**
<br>

### constructor( mimeParserPairs )

| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| mimeParserPairs | array | [] | Pairs of mime-type and parser-function in **mapable**[^mapable] format |

<br><br><br>



##  **Service**
<br>

### constructor(fetcher, responseProcessor, name)

| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| fetcher | Fetcher | null | Instance of Fetcher |
| responseProcessor | ResponseProcessor | null | Instance of ResponseProcessor |
| name | string | undefined | Service name |

<br><br>



## request({ handlerName, data, id })

| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| handlerName | string | undefined | Name of endpoint specified in endpoint metadata by handler property |
| data | object | {} | Request send data |
| id | string | undefined | A string which will replace {{id}} template in url |

<br><br>

## addHandler( handlerName, dataSchema )

| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| handlerName | string | undefined | The name of property which will be set on a service instance |
| dataSchema | object | undefined | The data schema of request send data |

<br><br>

## onBeforeRequest( callback )

| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| callback | function | (val) => val | The function which will be called as a hook |

<br><br>

## onResponseHandled( callback )

| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| callback | function | (val) => val | The function which will be called as a hook |

<br><br>

## onBeforeFetch( callback )

| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| callback | function | (val) => val | The function which will be called as a hook |

<br><br><br>



## ServiceFactory
<br>

### generateServices( api )

| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| api | object | undefined | An object that describe API modules; |

<br><br>

### generateService( apiModuleName, apiModuleSchema )

| Arg | Type | Default | Description |
| --- | --- | --- | --- |
| apiModuleName | string | undefined | Name of module which will be set as name of a service |
| apiModuleSchema | object | undefined | The metadata of endpoint |
<br><br><br>


[^mapable]: mapable means array which can be used for creating of map
