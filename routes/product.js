const express = require('express')
const {
  getAllProducts,
  insertProduct,
  updateProduct,
  getProductById,
  deleteProductById,
  getUserProductsById,
} = require('../controllers/product')
const { get } = require('mongoose')
const productRouter = express.Router()
productRouter.get('/', getAllProducts)
productRouter.post('/insert', insertProduct)
productRouter.put('/update/:productId', updateProduct)
productRouter.get('/:proid', getProductById)
productRouter.delete('/:prodeid', deleteProductById)
productRouter.get('/user/:Userid', getUserProductsById)

module.exports = productRouter
