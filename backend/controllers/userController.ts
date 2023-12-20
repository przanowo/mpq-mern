import { Request, Response } from 'express'
import asyncHandler from '../middleware/asyncHandler'
import User from '../models/userModel'
import jwt from 'jsonwebtoken'
import { RequestWithUser } from '../types/userType'

// @desc   Auth user & get token
// @route  POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    })

    // set as http only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    })

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc   Register new user.
// @route  POST /api/users
// @access Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    })

    // set as http only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc   Logout user / clear cookie
// @route  POST /api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    expires: new Date(0),
  })
  res.status(200).json({ message: 'Logged out successfully' })
})

// @desc   get User profile
// @route  GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const user = await User.findById(req.user?._id)

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  }
)

// @desc   Update user.
// @route  PUT  /api/users
// @access Private
const updateUserProfile = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const user = await User.findById(req.user?._id)

    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) {
        user.password = req.body.password
      }

      const updatedUser = await user.save()

      const token = jwt.sign(
        { userId: updatedUser._id },
        process.env.JWT_SECRET!,
        {
          expiresIn: '1d',
        }
      )

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  }
)

// @desc   get all users
// @route  GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  console.log('getUsers triggered')
  const users = await User.find({})
  console.log(users)
  res.status(200).json(users)
})

// @desc   Delete user
// @route  DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)

  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error('Cannot delete admin user')
    }
    await User.deleteOne({ _id: user._id })
    res.status(200).json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc   get user by id
// @route  GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.status(200).json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc   Update user.
// @route  PUT  /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = Boolean(req.body.isAdmin)

    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
