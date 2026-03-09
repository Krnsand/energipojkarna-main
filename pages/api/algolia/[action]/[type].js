import ProductHandler from 'algolia/ProductHandler'

const dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.config()

const documentTypeHandlers = { product: ProductHandler }
const allowedActions = ['publish', 'unpublish']

export default async function handler(req, res) {
  const { action, type } = req.query
  const { documents, secret } = req.body

  if (secret !== process.env.PRISMIC_WEBHOOK_SECRET) {
    return res.status(403).json({
      message: 'Unauthorized',
    })
  }

  // Check if action is allowed
  if (!allowedActions.includes(action)) {
    return res.status(400).json({
      message: `Action ${action} is not allowed`,
    })
  }

  // Check if type is allowed
  if (!Object.keys(documentTypeHandlers).includes(type)) {
    return res.status(400).json({
      message: `Type ${type} is not allowed`,
    })
  }

  // Check if handler exists
  if (!documentTypeHandlers[type]) {
    return res.status(400).json({
      message: `Handler for type ${type} is not implemented`,
    })
  }

  // Check if handler action exists
  if (!documentTypeHandlers[type][action]) {
    return res.status(400).json({
      message: `Handler action ${action} for type ${type} is not implemented`,
    })
  }

  try {
    await documentTypeHandlers[type][action](documents)
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    })
  }

  res.status(200).json()
}
