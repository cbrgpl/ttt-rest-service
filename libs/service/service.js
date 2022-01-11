const ResponseProcessor = require( './responseProcessor' );
const Fetcher = require( './fetcher' );

const { defaultHook } = require( '../helper/defaultHook' );


module.exports = class Service {
  static generateServices( { apiModules, responseProcessor } ) {
    const services = [];

    for( const moduleName in apiModules ) {
      const apiModule = apiModules[ moduleName ];
      const fetcher = new Fetcher( apiModule );

      services.push( new Service( {
        fetcher,
        responseProcessor,
        name: moduleName
      } ) );
    }
  }

  constructor( { moduleScheme, mimeParserPairs, invalidStatuses, fetcher = null, responseProcessor = null, name = null } ) {
    this.fetcher = fetcher === null ? new Fetcher( moduleScheme ) : fetcher;
    this.responseProcessor = responseProcessor === null ? new ResponseProcessor( mimeParserPairs, invalidStatuses ) : responseProcessor;

    this.name = name;

    this.hooks = {
      responseHandled: defaultHook,
    };
  }

  async request( ...params ) {
    const httpResponse = await this.fetcher.request( ...params );
    const handledResponse = await this.responseProcessor.processResponse( httpResponse );

    this.hooks.responseHandled( handledResponse );

    return handledResponse;
  }

  onBeforeFetch( callback ) {
    this.fetcher.onBeforeFetch( callback );
  }

  onResponseHandled( callback ) {
    this.responseHandled = callback;
  }
};
