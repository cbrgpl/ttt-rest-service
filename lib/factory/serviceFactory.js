import { Service } from './../service/service';

export class ServiceFactory {
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
    return apiModuleName + 'Service';
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
