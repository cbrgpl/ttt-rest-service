module.exports = class MimeTypeError extends Error {
  constructor( responseMimeType, ...params ) {
    super( ...params );

    this.responseMimeType = responseMimeType;
    this.name = 'MimeTypeError';
  }
};
