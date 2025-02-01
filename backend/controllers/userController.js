import User from '../models/User.js'
import jwt from 'jsonwebtoken'

// Generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  })
}

// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body
  console.log('Register endpoint hit')

  try {
    // Check if the user already exists
    console.log('Request body:', req.body)
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        details: 'The username or email is already in use.',
      })
    }

    // Create a new user
    const user = new User({ username, email, password })
    await user.save()
    console.log('User registered successfully:', user)

    // Respond with user data and JWT
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Error registering user:', error.message)
    res
      .status(500)
      .json({ error: 'Failed to register user', details: error.message })
  }
}

// Login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Find the user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Compare the password with the stored hash
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    // Respond with user data and JWT
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in', details: error.message })
  }
}

// Fetch user profile (protected)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'username email xp level',
    ) // Exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch profile', details: error.message })
  }
}
