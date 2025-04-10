export default {
  type: 'object',
  properties: {
    statusCode: {
      type: 'integer'
    },
    error: {
      type: 'string'
    },
    message: {
      type: 'string'
    }
  },
  additionalProperties: false,
  require: ['statusCode', 'error', 'message']
}
