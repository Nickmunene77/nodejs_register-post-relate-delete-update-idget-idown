const User = require('../models/User') // Import the User model
const bcrypt = require('bcryptjs') // Import the bcrypt library for password hashing

// Route handler to retrieve all users
const getAllUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find() // Retrieve all users from the database
  } catch (err) {
    return console.log(err) // Handle any errors that occur during the database query
  }

  if (!users) {
    return res.status(404).json({ message: 'There are no users found' }) // Return a 404 response if no users are found
  }
  return res.status(200).json({ users }) // Return a 200 response with the list of users in JSON format
}

// Route handler for user signup
const signup = async (req, res, next) => {
  const { name, email, password } = req.body // Extract user data from the request body
  let existingUser
  try {
    existingUser = await User.findOne({ email }) // Check if a user with the same email already exists
  } catch (err) {
    console.log(err) // Handle any errors that occur during the database query
  }
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' }) // Return a 400 response if a user with the same email exists
  }
  const hashedPassword = bcrypt.hashSync(password) // Hash the user's password using bcrypt
  const user = new User({
    name,
    email,
    password: hashedPassword, // Save the hashed password in the database
    products: [], // Initialize an empty array for user products
  })

  try {
    await user.save() // Save the new user to the database
  } catch (err) {
    return console.log(err) // Handle any errors that occur during user creation
  }
  return res.status(201).json({ user }) // Return a 201 response with the newly created user in JSON format
}

// Route handler for user login
const login = async (req, res, next) => {
  const { email, password } = req.body // Extract login credentials from the request body
  let existingUser
  try {
    existingUser = await User.findOne({ email }) // Find the user by their email address
  } catch (err) {
    console.log(err) // Handle any errors that occur during the database query
  }
  if (!existingUser) {
    return res.status(404).json({ message: 'No such user found' }) // Return a 404 response if no user with the provided email is found
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password) // Compare the provided password with the hashed password
  if (isPasswordCorrect) {
    return res.status(200).json({ message: 'Login successful' }) // Return a 200 response if the login is successful
  }
  return res.status(404).json({ message: 'Password incorrect' }) // Return a 404 response if the password is incorrect
}

module.exports = { getAllUsers, signup, login } // Export the route handlers
