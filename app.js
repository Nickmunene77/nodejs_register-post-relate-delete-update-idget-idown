const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/user')
const productRouter = require('./routes/product')

const app = express()

// Use the bodyParser middleware if needed
app.use(express.json())

app.use('/api/user', router)
app.use('/api/product', productRouter)

mongoose
  .connect(
    'mongodb+srv://nicknionene7:1910Nick@cluster0.8hueods.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(5000, () => {
      console.log('Server is listening on port 5000')
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  })
