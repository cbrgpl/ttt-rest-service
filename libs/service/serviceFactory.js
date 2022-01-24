const { Service } = require( './service' );

module.exports.ServiceFactory = class {
  static getServicesForApi( Constructor, constructorArgs, api ) {
    const factory = new Constructor( constructorArgs );

    const services = factory.generateServices( api );

    return services;
  }

  constructor( { responseProcessor = null } ) {
    this.responseProcessor = responseProcessor;
  }

  generateServices( api ) {
    const services = {};

    for( const apiModule in api ) {
      const service = this.generateService( apiModule, api[ apiModule ] );
      services[ service.name ] = service;
    }

    return services;
  }

  getServiceName( apiModule ) {
    return apiModule.charAt( 0 ).toUpperCase() + apiModule.slice( 1 ) + 'Service';
  }

  generateService( apiModule, apiModuleSchema ) {
    const name = this.getServiceName( apiModule );
    const service = new Service( {
      name,
      apiModuleSchema,
      responseProcessor: this.responseProcessor,
    } );

    for( const requestMetadata of apiModuleSchema ) {
      const handlerName = requestMetadata.handler;

      service.addHandler( {
        handlerName,
        dataSchema: requestMetadata.schema,
      } );
    }

    return service;
  }
};
