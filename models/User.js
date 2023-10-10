const mongoose = require('mongoose') // Import the Mongoose library

const schema = mongoose.Schema // Create a schema using Mongoose's Schema constructor

// Define the user schema with specific fields and their data types
const userSchema = new schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String, // The 'email' field is of type String
    require: true, // It is required
    unique: true, // It must be unique among all users (no duplicate email addresses)
  },
  password: {
    type: String, // The 'password' field is of type String
    require: true, // It is required
  },
  products: [
    {
      type: mongoose.Types.ObjectId, // The 'products' field is an array of ObjectIDs
      ref: 'Product', // It references the 'Product' model
      require: true, // It is required (must be provided when creating a user)
    },
  ],
})

// Export the user schema as a Mongoose model with the name 'User'
module.exports = mongoose.model('User', userSchema)
