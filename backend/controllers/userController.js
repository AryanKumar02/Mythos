import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  })
}

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body
  console.log('Register endpoint hit')

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        details: 'The username or email is already in use.',
      })
    }

    const user = new User({ username, email, password })
    await user.save()
    console.log('User registered successfully:', user)

    const token = generateToken(user._id)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
      avatarUrl: user.avatarUrl,
    })
  } catch (error) {
    console.error('Error registering user:', error.message)
    res
      .status(500)
      .json({ error: 'Failed to register user', details: error.message })
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user._id)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
      avatarUrl: user.avatarUrl,
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
    )
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

// Update avatar settings for the user
export const updateAvatar = async (req, res) => {
  const { avatarSeed } = req.body
  try {
    // Update the user's avatarSeed only
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarSeed },
      { new: true },
    )
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({
      message: 'Avatar updated successfully',
      avatarUrl: user.avatarUrl, // This uses the virtual property from the User schema
    })
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to update avatar', details: error.message })
  }
}
