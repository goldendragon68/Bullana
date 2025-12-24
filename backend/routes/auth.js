const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const validator = require('validator');
const speakeasy = require('speakeasy');
const useragent = require('useragent');

// Import helpers
const encrypt = require('../helpers/encrypt');
const common = require('../helpers/common');
const auth = require('../middleware/auth');

// Import models
const users = require('../model/users');
const logs = require('../model/user_history');

// Modern user login route
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		
		// Validate input
		if (!validator.isEmail(email) || validator.isEmpty(password)) {
			return res.status(400).json({
				success: false,
				message: 'Valid email and password are required'
			});
		}

		// Find user with encrypted email
		const userEmail = email.toLowerCase();
		const firstEmail = encrypt.encryptNew(common.firstNewMail(userEmail));
		const secondEmail = encrypt.encryptNew(common.secondNewMail(userEmail));
		
		const userData = await users.findOne({
			luck_value: firstEmail, 
			added_value: secondEmail
		}).select('_id status protect_key tfa_status user_favourites liked_game username');

		if (!userData) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password'
			});
		}

		// Check password
		const isPasswordValid = await new Promise((resolve) => {
			encrypt.comparePswd(password, userData.protect_key, resolve);
		});

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password'
			});
		}

		// Check account status
		if (userData.status === 0 || userData.status === 100) {
			return res.status(403).json({
				success: false,
				message: 'Please activate your account'
			});
		}

		if (userData.status === 2) {
			return res.status(403).json({
				success: false,
				message: 'Your account has been blocked'
			});
		}

		// If 2FA is enabled, return temp token
		if (userData.tfa_status === 1) {
			const tempToken = encrypt.encryptNew(userData._id.toString());
			return res.json({
				success: true,
				requiresTFA: true,
				tempToken: encodeURIComponent(tempToken),
				message: 'Please enter your 2FA code'
			});
		}

		// Log the login
		const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
		const cleanIP = ip.replace('::ffff:', '');
		const agent = useragent.parse(req.headers['user-agent']);
		const os = agent.os.toString().split(' ')[0];
		const browser = agent.toAgent().split(' ')[0];
		
		const logData = {
			user_id: userData._id,
			ip_address: cleanIP,
			browser: browser,
			deviceinfo: os,
			types: 'Account Login'
		};

		await logs.create(logData);

		// Create JWT token with user info
		const userForToken = {
			_id: userData._id,
			email: userEmail,
			username: userData.username
		};

		const token = auth.createUserToken(userForToken);

		res.json({
			success: true,
			token: token,
			user: {
				id: userData._id,
				username: userData.username,
				email: userEmail,
				favourites: userData.user_favourites || [],
				liked: userData.liked_game || []
			},
			message: 'Login successful'
		});

	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
});

// Modern 2FA verification route
router.post('/verify-2fa', async (req, res) => {
	try {
		const { tempToken, tfaCode } = req.body;
		
		if (!tempToken || !tfaCode) {
			return res.status(400).json({
				success: false,
				message: 'Temp token and 2FA code are required'
			});
		}

		// Decrypt temp token to get user ID
		const userId = encrypt.decryptNew(decodeURIComponent(tempToken));
		
		const userData = await users.findById(userId).select('tfa_code username luck_value added_value user_favourites liked_game');
		if (!userData) {
			return res.status(401).json({
				success: false,
				message: 'Invalid verification token'
			});
		}

		// Verify 2FA code
		const verified = speakeasy.totp.verify({
			secret: encrypt.withDecrypt(userData.tfa_code),
			encoding: 'base32',
			token: tfaCode,
			window: 1
		});

		if (!verified) {
			return res.status(401).json({
				success: false,
				message: 'Invalid 2FA code'
			});
		}

		// Log successful 2FA login
		const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
		const cleanIP = ip.replace('::ffff:', '');
		const agent = useragent.parse(req.headers['user-agent']);
		const os = agent.os.toString().split(' ')[0];
		const browser = agent.toAgent().split(' ')[0];
		
		const logData = {
			user_id: userId,
			ip_address: cleanIP,
			browser: browser,
			deviceinfo: os,
			types: 'Account Login with 2FA'
		};

		await logs.create(logData);

		// Get user email for token
		const userEmail = encrypt.decryptNew(userData.luck_value) + encrypt.decryptNew(userData.added_value);

		// Create JWT token
		const userForToken = {
			_id: userData._id,
			email: userEmail,
			username: userData.username
		};

		const token = auth.createUserToken(userForToken);

		res.json({
			success: true,
			token: token,
			user: {
				id: userData._id,
				username: userData.username,
				email: userEmail,
				favourites: userData.user_favourites || [],
				liked: userData.liked_game || []
			},
			message: 'Login successful'
		});

	} catch (error) {
		console.error('2FA verification error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
});

// Get current user profile
router.get('/profile', auth.authenticateUser, (req, res) => {
	try {
		const userEmail = encrypt.decryptNew(req.user.luck_value) + encrypt.decryptNew(req.user.added_value);
		
		res.json({
			success: true,
			user: {
				id: req.user._id,
				username: req.user.username,
				email: userEmail,
				status: req.user.status,
				tfa_status: req.user.tfa_status,
				kyc_status: req.user.kyc_status,
				favourites: req.user.user_favourites || [],
				liked: req.user.liked_game || []
			}
		});
	} catch (error) {
		console.error('Profile fetch error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
});

// Logout route
router.post('/logout', auth.authenticateUser, (req, res) => {
	// With JWT, logout is handled client-side by removing the token
	// Optionally, you could implement a token blacklist here
	res.json({
		success: true,
		message: 'Logged out successfully'
	});
});

// Token validation endpoint
router.get('/validate', auth.authenticateUser, (req, res) => {
	res.json({
		success: true,
		valid: true,
		user: {
			id: req.user._id,
			username: req.user.username,
			type: req.userToken.type
		}
	});
});

module.exports = router;
