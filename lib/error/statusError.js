export class StatusError extends Error {
  constructor( status, url, ...params ) {
    super( ...params );
    this.name = 'StatusError';

    this.httpStatus = status;
    this.url = url;
  }
};
