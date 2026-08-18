const User = require('../models/User');
const generateToken = require('../config/utils');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (user && (await user.comparePassword(password))) {
        res.json({
            id: user.id,
            username: user.username,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
};

// @desc    Register a new user (Internal/Setup only)
// @route   POST /api/auth/register
// @access  Private/Admin
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    const userExists = await User.findOne({ where: { username } });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        username,
        password,
        role,
    });

    if (user) {
        res.status(201).json({
            id: user.id,
            username: user.username,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

module.exports = { loginUser, registerUser };
