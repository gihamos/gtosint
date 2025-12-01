import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import debug from 'debug';

const logger = debug('back:controller:auth');

export const register = async (req, res) => {
  logger('register request received');
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, name and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, pseudos: [], country: null, games: [] });

    await newUser.save();
    res.status(201).json({ message: 'User successfully created' });

  } catch (err) {
    logger('Error during registration', err);
    res.status(500).json({ message: 'An error occurred while registering. Please try again later.' });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token: token });
  } catch (err) {
    logger('Login error:', err);
    res.status(500).json({ message: 'An internal server error occurred' });
  }
};


export const isAuth = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user: user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err });
  }
};