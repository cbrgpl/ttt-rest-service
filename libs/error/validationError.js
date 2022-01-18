module.exports.ValidationError = class extends Error {
  constructor( data, dataScheme, caller, validatorErrors, ...params ) {
    super( ...params );


    this.data = data;
    this.caller = caller;
    this.dataScheme = dataScheme;
    this.validatorErrors = validatorErrors;
  }
};
