import express from 'express';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: '15d' }
    );
}

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        if( password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await  User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = generateToken(user);
            res.status(200).json({
                token,
                user: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    profilePicture: user.profilePicture,
                },
            });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
        console.error('Error during login:', error);
    }

});
router.post('/register', async (req, res) => {
    try{
        const { firstname, lastname, email, password } = req.body;
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (!/^[a-zA-Z]+$/.test(firstname) || !/^[a-zA-Z]+$/.test(lastname)) {
            return res.status(400).json({ message: 'First name and last name must contain only letters' });
        }
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const profilePicture = `https://api.dicebear.com/9.x/avataaars/svg?seed=${email}`;
        
        const newUser = new User({ firstname, lastname, email, password, profilePicture: profilePicture });
        
        newUser.save();

        const token = generateToken(newUser._id);
        res.status(201).json({
            token: token,
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            },
        });

    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
        console.error('Error during registration:', error);
    }
});


export const AuthRoutes = router;