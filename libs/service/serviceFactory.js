const { Service: DefaultService } = require( './service' );

module.exports.ServiceFactory = class ServiceFactory {
  static generateServices( serviceFactory, apiModules ) {
    if( !( serviceFactory instanceof ServiceFactory ) && serviceFactory.prototype !== ServiceFactory ) {
      throw TypeError( 'Passed serviceFactory is not extend ServiceFactory Class' );
    }

    const services = {};

    for( const moduleName in apiModules ) {
      const service = serviceFactory.generateService( moduleName, apiModules[ moduleName ] );
      services[ service.name ] = service;
    }

    return services;
  }

  constructor( { Service = DefaultService, responseProcessor = null } ) {
    this.Service = Service;
    this.responseProcessor = responseProcessor;
  }

  getServiceName( moduleName ) {
    return moduleName.charAt( 0 ).toUpperCase() + moduleName.slice( 1 ) + 'Service';
  }

  generateService( moduleName, apiModule ) {
    const serviceName = getServiceName( moduleName );
    const service = new this.Service( {
      name: serviceName,
      moduleScheme: apiModule,
      responseProcessor: this.responseProcessor,
    } );

    for( const endpointMetadata of apiModule ) {
      const handlerName = endpointMetadata.handler;

      service.addHandler( {
        handlerName,
        dataScheme: endpointMetadata.scheme,
      } );
    }

    return service;
  }
};
