const { MimeError } = require( './libs/error/mimeError' );
const { StatusError } = require( './libs/error/statusError' );
const { ValidationError } = require( './libs/error/validationError' );

module.exports = {
  MimeError,
  StatusError,
  ValidationError
};
