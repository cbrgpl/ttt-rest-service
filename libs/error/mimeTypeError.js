module.exports.MimeTypeError = class extends Error {
  constructor( responseMimeType, ...params ) {
    super( ...params );

    this.responseMimeType = responseMimeType;
    this.name = 'MimeTypeError';
  }
};
