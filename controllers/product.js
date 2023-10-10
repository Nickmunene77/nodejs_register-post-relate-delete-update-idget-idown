const { default: mongoose } = require('mongoose')
const User = require('../models/User')
const Product = require('../models/product')
const getAllProducts = async (req, res, next) => {
  let product
  try {
    product = await Product.find()
  } catch (err) {
    return console.log(err)
  }

  if (!product) {
    return res.status(404).json({ message: 'There are no product found' })
  }
  return res.status(200).json(product)
}
const insertProduct = async (req, res, next) => {
  const { title, description, image, user } = req.body

  let existingUser
  try {
    existingUser = await User.findById(user)
  } catch (error) {
    return console.log(error)
  }

  if (!existingUser) {
    res.status(400).json({ message: 'unauthorized user by the given id' })
  }
  const product = new Product({
    title,
    description,
    image,
    user,
  })

  try {
    const session = await mongoose.startSession()
    session.startTransaction()
    await product.save({ session })
    existingUser.products.push(product)
    await existingUser.save(session)
    await session.commitTransaction()
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err })
  }
  return res.status(200).json({ product })
}
const updateProduct = async (req, res, nest) => {
  const { title, description, image } = req.body
  const productId = req.params.productId
  let product

  try {
    product = await Product.findByIdAndUpdate(productId, {
      title,
      description,
      image,
    })
  } catch (error) {
    console.log(error)
  }

  if (!product) {
    return res.status(500).json({ message: 'Product not updated' })
  }
  return res.status(200).json({ product })
}
const getProductById = async (req, res, next) => {
  const proId = req.params.proid //this is as indicated in the routes file

  try {
    const product = await Product.findById(proId)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.status(200).json({ product })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
const deleteProductById = async (req, res, next) => {
  const proId = req.params.prodeid // Ensure this matches your route parameter name

  try {
    const product = await Product.findByIdAndRemove(proId).populate('user')

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Remove the product reference from the user
    await product.user.products.pull(product)
    await product.user.save()

    return res.status(200).json({ message: 'Product deleted' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const getUserProductsById = async (req, res, next) => {
  const Userid = req.params.Userid
  let UserProducts
  try {
    UserProducts = await User.findById(Userid).populate('products')
  } catch (error) {
    console.log(error)
  }
  if (!UserProducts) {
    res.status(404).json({ message: 'No products posted' })
  }
  return res.status(200).json({ UserProducts })
}

module.exports = {
  getAllProducts,
  insertProduct,
  updateProduct,
  getProductById,
  deleteProductById,
  getUserProductsById,
}
