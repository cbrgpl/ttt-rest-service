export const endpointMetadataSchema = {
  type: 'object',
  required: [ 'method', 'url', 'handler' ],
  properties: {
    method: {
      type: 'string'
    },
    url: {
      type: 'string'
    },
    handler: {
      description: 'Requset function name',
      type: 'string'
    },
    schema: {
      description: 'Data validation schema',
      type: 'object',
    },
    roles: {
      description: 'Roles required by request',
      type: 'array'
    },
    secure: {
      description: 'Is Authorize Token required flag',
      type: 'boolean'
    }
  },
  additionalProperties: false
};
