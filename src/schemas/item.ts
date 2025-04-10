export const filter = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    limit: {
      type: 'integer',
      minimum: 1,
      default: 10
    },
    offset: {
      type: 'integer',
      minimum: 0,
      default: 0
    }
  },
  additionalProperties: false
}

export const create = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    price: {
      type: 'number',
      minimum: 0
    }
  },
  required: ['name', 'price'],
  additionalProperties: false
}

export const update = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    price: {
      type: 'number',
      minimum: 0
    }
  },
  additionalProperties: false
}

export const item = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    price: { type: 'number', minimum: 0 }
  },
  required: ['id', 'name', 'price']
}

export const filterResponse = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: item
    },
    total: { type: 'number', minimum: 0 }
  },
  required: ['data', 'total']
}

export const id = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      minimum: 0
    }
  }
}
