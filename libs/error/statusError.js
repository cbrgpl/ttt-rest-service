module.exports = class StatusError extends Error {
  constructor( status, url, ...params ) {
    super( ...params );
    this.message = `Got invalid status;\nstatus - ${ status },\nurl - ${ url }`;
    this.name = 'StatusError';

    this.httpStatus = status;
    this.url = url;
  }
};
