
module.exports = class EndpointError extends Error {
  constructor( endpointName, ...params ) {
    super( ...params );

    this.name = 'EndpointError';
    this.endpointName = endpointName;
  }
};
