const { Service } = require( './service' );

module.exports.ServiceFactory = class {
  constructor(  fetcherFactory = null, responseProcessor = null ) {
    this.responseProcessor = responseProcessor;
    this.fetcherFactory = fetcherFactory;
  }

  generateServices( api ) {
    const services = {};

    for( const apiModuleName in api ) {
      const service = this.generateService( apiModuleName, api[ apiModuleName ] );
      services[ service.name ] = service;
    }

    return services;
  }

  getServiceName( apiModuleName ) {
    return apiModuleName.charAt( 0 ).toUpperCase() + apiModuleName.slice( 1 ) + 'Service';
  }

  generateService( apiModuleName, apiModuleSchema ) {
    const name = this.getServiceName( apiModuleName );
    const fetcher = this.fetcherFactory.getFetcher( apiModuleSchema );
    const service = new Service( fetcher, this.responseProcessor, name );

    for( const requestMetadata of apiModuleSchema ) {
      const handlerName = requestMetadata.handler;

      service.addHandler( handlerName, requestMetadata.schema );
    }

    return service;
  }
};
