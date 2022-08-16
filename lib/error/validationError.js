export class ValidationError extends Error {
  constructor( data, dataSchema, caller, validatorErrors, ...params ) {
    super( ...params );


    this.data = data;
    this.caller = caller;
    this.dataSchema = dataSchema;
    this.validatorErrors = validatorErrors;
  }
};
