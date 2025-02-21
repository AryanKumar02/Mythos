import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import crypto from 'crypto' // For generating unique tokens
import validator from 'validator' // For email validation

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: validator.isEmail, // Validate email format
        message: 'Please provide a valid email address',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Ensure password is at least 8 characters long
      validate: {
        validator: function (v) {
          if (!/(?=.*[A-Z])/.test(v)) {
            throw new Error(
              'Password must contain at least one uppercase letter',
            )
          }
          if (!/(?=.*\W)/.test(v)) {
            throw new Error(
              'Password must contain at least one special character',
            )
          }
          if (!/(?=.*\d)/.test(v)) {
            throw new Error('Password must contain at least one digit')
          }
          return true
        },
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Role-based access control
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false, // For email verification
    },
    resetPasswordToken: {
      type: String,
      default: null, // Token for password reset
    },
    resetPasswordExpires: {
      type: Date,
      default: null, // Expiry for the password reset token
    },
    streak: {
      type: Number,
      default: 0, // Tracks the current streak
    },
    lastStreakDate: {
      type: Date,
      default: null, // The last date the streak was updated
    },
    dailyQuestCount: {
      type: Number,
      default: 0, // Tracks the number of quests completed today
    },
    // XP & Leveling System
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    avatarSeed: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }, // Automatically add createdAt and updatedAt fields
)

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next() // Skip hashing if password is unchanged
  try {
    const salt = await bcrypt.genSalt(10) // Generate a salt
    this.password = await bcrypt.hash(this.password, salt) // Hash the password
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch {
    throw new Error('Password comparison failed')
  }
}

// Method to generate a password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex') // Generate a random token
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex') // Hash the token
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000 // Token valid for 10 minutes
  return resetToken
}

// Virtual property to generate the avatar URL from the public assets folder
userSchema.virtual('avatarUrl').get(function () {
  // Check if avatarSeed is provided and not just empty whitespace
  if (this.avatarSeed && this.avatarSeed.trim() !== '') {
    let seed = this.avatarSeed
    // If the seed already contains a full path, return it as-is.
    if (seed.startsWith('/assets/avatars/')) {
      return seed
    }
    // Otherwise, construct the URL using the base path and append .svg
    return `/assets/avatars/${encodeURIComponent(seed)}.svg`
  }
  // If no avatarSeed is set, return a specific default avatar.
  return `/assets/avatars/default.svg`
})

// Ensure that virtual properties are included when converting to JSON/objects
userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })

// Create and export the User model
const User = mongoose.model('User', userSchema)

export default User // Export the User model
