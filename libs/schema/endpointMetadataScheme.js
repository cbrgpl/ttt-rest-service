module.exports.endpointMetadataScheme = {
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
    scheme: {
      description: 'Data validation scheme',
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
