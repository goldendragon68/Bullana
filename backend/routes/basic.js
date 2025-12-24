const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const async  = require('async');

const moment = require('moment');
const validator = require('validator');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const useragent = require('useragent');
const multer = require('multer');

//helpers
const encrypt = require('../helpers/encrypt');
const common = require('../helpers/common');
const mail = require('../helpers/mail');
const cloudinary = require('../helpers/cloudinary');
const game = require('../helpers/game');

// Auth middleware
const auth = require('../middleware/auth');

//schemas
const users = require('../model/users');
const logs = require('../model/user_history');
const currency = require('../model/currency');
const wallet = require('../model/userWallet');
const referrals = require('../model/referral');
const gamelist = require('../model/gamelist');
const siteSettings = require('../model/siteSettings');
const deposit = require('../model/deposit');
const withdraw = require('../model/withdraw');
const vipLvl = require('../model/vip_level');
const notify = require('../model/notify');
const blog = require('../model/blog');
const spinBonus = require('../model/spin_bonus');

const betHis = require('../model/bet_history');
const coinflipBetHis = require('../model/coinflip_bethis');
const kenoBetHis = require('../model/keno_bet_history');
const minesBetHis = require('../model/mines_bethistory');
const wheelBetHis = require('../model/wheel_result');
const fortuneBetHis = require('../model/wheeloffortune');
const rouletteBetHis = require('../model/roulette_bethistory');
const swordBetHis = require('../model/sword_bethistory');
const caveBetHis = require('../model/cave_bethistory');
const plinkoBetHis = require('../model/plinko_bethistory');

var storage = multer.diskStorage({
	filename: function (req, file, cb) {
		cb(null, common.randomString(4) + new Date().getTime() + file.originalname);
	}
});
var upload = multer({ storage: storage });


// Binance API commented out for local development
// const Binance = require('binance-api-node').default
// const client = Binance();
// const client2 = Binance({
//   apiKey: 'N5IK3wHDnzYFqx0LdTUMHSiEPwY1ilehE18Elhd35fzqJeuvmLXhaVgPvM0W7AqO',
//   apiSecret: '7heODUi1h6rhTOUZsnU8sIGiomOytnpTAVRlXHyrwfXDDwz5o0DOIistaHgTKemF',
//   getTime: Date.now,
// });
// client.time().then(time => console.log(time));

const axios = require('axios');

const API_KEY = 'N5IK3wHDnzYFqx0LdTUMHSiEPwY1ilehE18Elhd35fzqJeuvmLXhaVgPvM0W7AqO';
const API_SECRET = '7heODUi1h6rhTOUZsnU8sIGiomOytnpTAVRlXHyrwfXDDwz5o0DOIistaHgTKemF';
const API_ENDPOINT = 'https://api.binance.com/wapi/v3/createWithdraw.html';

const params = {
  apiKey: API_KEY,
  asset: 'BTC', // The asset for which you want to create a new address
  recvWindow: 60000, // Optional
};

/*const ethers = require('ethers');
const bip39 = require('bip39');
const crypto = require('crypto');
//const mnemonic = bip39.entropyToMnemonic(crypto.randomBytes(32));*/

router.get('/sampleBin', async function(req, res){
	
		/*axios.post(API_ENDPOINT, null, { params })
	  .then(response => {
	    if (response.data && response.data.success) {
	      const newAddress = response.data.address;
	      console.log('New Address:', newAddress);
	    } else {
	      console.error('Failed to create a new address:', response.data);
	    }
	  })
	  .catch(error => {
	    console.error('Error:', error);
	  });*/

		// var add = await client2.depositAddress({ coin: 'BTC' });
		// return res.json({add:add});
		return res.json({add: "Binance disabled for local development"});
		//https://www.npmjs.com/package/binance-api-node#deposithistory
});

 
router.get('/testFunction', function(req, res){
	res.json({success:"true",msg:"success"});
});

// Database connection status endpoint
router.get('/db-status', (req, res) => {
	const dbManager = require('../utils/database');
	const status = dbManager.getStatus();
	
	res.json({
		success: true,
		database: status,
		timestamp: new Date().toISOString()
	});
});

// Test database connectivity
router.get('/db-test', async (req, res) => {
	try {
		const dbManager = require('../utils/database');
		const rawTest = await dbManager.testRawConnection();
		const status = dbManager.getStatus();
		
		res.json({
			success: true,
			tests: {
				mongoose: status.connected,
				rawMongoDB: rawTest,
				overall: status.connected || rawTest
			},
			database: status,
			message: status.connected ? 'Database fully operational' : 'Database connectivity issues detected'
		});
	} catch (error) {
		res.json({
			success: false,
			error: error.message,
			message: 'Database test failed'
		});
	}
});

// Mock endpoints for testing without database
router.post('/mock/signup', (req, res) => {
	const { username, email, password } = req.body;
	
	if (!username || !email || !password) {
		return res.json({
			success: 0, 
			msg: "Please enter all details"
		});
	}
	
	// Mock successful signup
	res.json({
		success: 1, 
		msg: "Mock user created successfully",
		user: { username, email }
	});
});

router.post('/mock/login', (req, res) => {
	const { email, password } = req.body;
	
	if (!email || !password) {
		return res.json({
			success: false, 
			message: "Email and password are required"
		});
	}
	
	// Mock successful login with JWT token
	const mockUser = {
		_id: "mock_user_id_123",
		email: email,
		username: "mockuser"
	};
	
	const token = auth.createUserToken(mockUser);
	
	res.json({
		success: true,
		token: token,
		user: {
			id: mockUser._id,
			username: mockUser.username,
			email: mockUser.email
		},
		message: "Mock login successful"
	});
});

router.get('/mock/profile', auth.authenticateUser, (req, res) => {
	res.json({
		success: true,
		user: {
			id: req.user.userId,
			email: req.user.email,
			username: req.user.username
		},
		message: "Mock profile data"
	});
});


router.get('/logs', (req,res) => {
 var path = require('path');
 var file = path.join(__dirname, '.././logs/combined.outerr-0.log');
 res.download(file);
})


router.post('/getCurrencyInfo', function(req, res) {
		var curr = req.body.currency;
		currency.findOne({currency : curr},{min_bet:1 ,max_bet: 1, network:1, type:1, max_withdraw:1, min_withdraw:1, withdraw_fee:1, max_deposit:1, min_deposit:1}).exec(function(err1, res1) {
				if(res1) {
						res.json({success:1, min_bet:res1.min_bet, max_bet: res1.max_bet, currData:res1});
				} else {
						res.json({success:0,min_bet:100, max_bet: 10000000});
				}
		});
});

router.post('/getBalance', common.userVerify, function(req, res) {
		var userCurr = req.body.currency;
		var userId = mongoose.mongo.ObjectId(req.userId);
		wallet.findOne({user_id: userId}).exec(function(err1, res1){
        if(res1){
           	var valueOfcurrency = res1.wallet.find(curr => curr.currency === userCurr);
           	res.json({success:1,balance:valueOfcurrency.amount});
         } else {
         		res.json({success:1,balance:100000}); //testing
         }
    });
});

router.post('/getminbetamount', common.userVerify, function(req, res) {
		var userCurr = req.body.currency;
		currency.findOne({currency: userCurr}).exec(function(err1, res1){
        if(res1){
           	res.json({success:1,min_bet:res1.min_bet, max_bet:res1.max_bet});
        } else {
         		res.json({success:0});
        }
    });
});


router.get('/generateAddress', function(req, res) {
		var userCurr = 'BNB';
		var userid = "643e3f08b0294a5484a68890";
		game.generateAddress('BNB', userid);
})


router.post('/findUsername', function (req, res) {
	// req.body.username = req.body.username.toUpperCase();
	users.findOne({username:req.body.username}).exec(function(err, data){
		if(data){
			return res.json({success:0, msg:"username already exists"});
		}else{
			return res.json({success:1, msg:"username not defined!"});
		}
	})
})

router.post('/findEmail', function (req, res) {
	var email = req.body.email;
	let e = validator.isEmail(email);
	let usrmail   = email.toLowerCase();
	var firstEmail = encrypt.encryptNew(common.firstNewMail(usrmail));
	var secondEmail = encrypt.encryptNew(common.secondNewMail(usrmail));
	users.find({$and:[{luck_value:firstEmail, added_value:secondEmail}]}).countDocuments().exec(function(userErr,userRes){
		if(userRes && e) {
			return res.json({success:0, msg:"Email already exists"});
		} else {
			return res.json({success:1});
		}
  	});
})

router.post('/signup', (req,res) => {
	try {
		let info = req.body;
		let email = validator.isEmail(info.email);
		// let cunty = validator.isEmpty(info.country);
		let nam = validator.isEmpty(info.username);
		let hasWallet = info.walletAddress && !validator.isEmpty(info.walletAddress);
		
		if(email && !nam && hasWallet) {
			let usermail = info.email.toLowerCase();
			var firstEmail = encrypt.encryptNew(common.firstNewMail(usermail));
			var secondEmail = encrypt.encryptNew(common.secondNewMail(usermail));
			// Check if user exists with email or username
			users.findOne({$or:[{luck_value:firstEmail, added_value:secondEmail}, {username: info.username}]}).exec(function(userErr,existingUser) {
				if(existingUser) {
					// If user exists and is already verified, reject registration
					if(existingUser.status === 1) {
						res.json({success:0, msg:"Username/Email already exists and is verified"});
						return;
					}
					
					// If user exists but is not verified, allow re-registration
					// Update existing user with new data and resend verification
					if(existingUser.status === 0) {
						var verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
						
						// Update existing user
						users.updateOne(
							{_id: existingUser._id}, 
							{
								$set: {
									// Update wallet info if provided
									wallet_address: info.walletAddress || existingUser.wallet_address,
									wallet_type: info.walletType || existingUser.wallet_type,
									wallet_connected_at: info.walletAddress ? new Date() : existingUser.wallet_connected_at,
									// Update verification code
									verification_code: verificationCode,
									verification_code_expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
								}
							}
						).exec(function(updateErr, updateRes) {
							if(updateRes) {
								var specialVars = { 
									'###USER###': existingUser.username, 
									'###CODE###': verificationCode,
								};
								
								// Send verification email
								mail.sendMail(info.email.toLowerCase(), 'verification_mail', specialVars, function(mailRes) {	
									console.log('Verification email resent for existing unverified user:', mailRes);
								});
								
								res.json({
									success: 1, 
									msg: 'Registration updated! Please check your email for the new verification code.'
								});
							} else {
								res.json({success:0, msg:"Failed to update registration"});
							}
						});
						return;
					}
				} else {
					var pwds =[];
					var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
					ip = ip.replace('::ffff:', '');
					var qrName = `ROLLGAME (${usermail})`;
					var secret = speakeasy.generateSecret({ length: 10, name: qrName });					
					var tfaCode = secret.base32;
					var tfaUrl = secret.otpauth_url;
					var url = tfaUrl.replace(tfaCode, "");
					common.checkRefer(info.refer, (refRes) => {
						if(refRes) {
							common.referId((refId) => {
								/*common.uniqueName((useName) => {*/
									encrypt.hashPswd(info.password, function(pass) {
										pwds.push(pass)
										if(info.refer != ""){var ref_status = 1};
										let obj = {
											username		: info.username,
											luck_value	: firstEmail,
											added_value : secondEmail,
											protect_key 	: pass,
											tfa_code    : encrypt.withEncrypt(tfaCode),
											tfa_url     : url,
											status 		  : 0,  // Pending email verification
											referr_id    : refId,
											referrer_id : info.refer,
											// country 		: info.country,
											ip_address  : ip,
											ref_status: ref_status,
											secretkey 	: pwds,
											// Wallet fields
											wallet_address: info.walletAddress || '',
											wallet_type: info.walletType || '',
											wallet_connected_at: info.walletAddress ? new Date() : null,
										}
									  users.create(obj, function(err,resData) {
											if(resData) {
												var userId = resData._id;
												var encuId = encrypt.encryptNew(userId.toString());
												var uri = common.getUrl()+'activate_account?token='+encodeURIComponent(encuId);
												// console.log(uri);
												
												// Generate 4-digit verification code
												var verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
												
												// Store verification code in user document (temporary field)
												users.updateOne(
													{_id: resData._id}, 
													{
														$set: {
															verification_code: verificationCode,
															verification_code_expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
														}
													}
												).exec();
												
												var specialVars = { 
													'###LINK###': uri, 
													'###USER###': info.username, 
													'###CODE###': verificationCode,
													'###LINK1###': uri 
												};
												
												// Send verification email
												mail.sendMail(usermail, 'verification_mail', specialVars, function(mailRes) {	
													console.log('Verification email sent:', mailRes);
												});

												gamelist.find({},{_id:0,game_name:1}).exec(function(Err,Res) {
													let Data = {"gamecount":[]};
									    		common.gamecount(Res,resData._id ,function(data) {})
									    	})
												currency.find({},{_id:0,currency:1}).exec(function(curErr,curRes) {
													let walData = {"wallet":[], "user_id":resData._id};													common.wagecount(curRes,resData._id ,function(data) {})
								    			common.activateWallet(curRes, walData, function(data) {
							    				game.generateAddress('BNB', userId);
													wallet.create(data, function(walErr,walRes) {
														if(walRes) {
															res.json({
																success: 1, 
																msg: 'Registration successful! Please check your email for the verification code.'
															});
														} else {
															res.json({success:0, msg:"Failed to create wallet"});
														}
													});
													});
												});
											} else {
												res.json({success:0, msg:'Failed to create an user.'});	
											}
										});
									});
								/*})*/
							})
						}else{
							return res.json({success:0, msg:"Invalid Refer ID"});
						}
					})
				} // End of existing user check
			});
		} else {
			if (!email) {
				res.json({success:0, msg:"Please enter a valid email address"});
			} else if (nam) {
				res.json({success:0, msg:"Please enter a username"});
			} else if (!hasWallet) {
				res.json({success:0, msg:"Please connect your Phantom wallet to continue"});
			} else {
				res.json({success:0, msg:"Please enter all details"});
			}
		}
	} catch(e) {
		res.json({success:0, msg:"Something went wrong"});
	}
});

// Modern user login route
router.post('/auth/login', async (req, res) => {
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
router.post('/auth/verify-2fa', async (req, res) => {
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
		
		const userData = await users.findById(userId).select('tfa_code username');
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
		const fullUserData = await users.findById(userId).select('luck_value added_value user_favourites liked_game');
		const userEmail = encrypt.decryptNew(fullUserData.luck_value) + encrypt.decryptNew(fullUserData.added_value);

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
				favourites: fullUserData.user_favourites || [],
				liked: fullUserData.liked_game || []
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
router.get('/auth/profile', auth.authenticateUser, (req, res) => {
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
router.post('/auth/logout', auth.authenticateUser, (req, res) => {
	// With JWT, logout is handled client-side by removing the token
	// Optionally, you could implement a token blacklist here
	res.json({
		success: true,
		message: 'Logged out successfully'
	});
});

// Dashboard endpoints
router.get('/user/dashboard-stats', auth.authenticateUser, async (req, res) => {
	try {
		const userId = req.user.id;
		
		// Get user's game statistics
		const [totalGames, totalWins, totalLosses] = await Promise.all([
			betHis.countDocuments({ userid: userId }),
			betHis.countDocuments({ userid: userId, status: 'win' }),
			betHis.countDocuments({ userid: userId, status: 'lose' })
		]);

		// Calculate win rate
		const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;

		// Get total earnings (this is a simplified calculation)
		const earnings = await betHis.aggregate([
			{ $match: { userid: mongoose.Types.ObjectId(userId), status: 'win' } },
			{ $group: { _id: null, total: { $sum: '$winAmount' } } }
		]);

		const totalEarnings = earnings.length > 0 ? earnings[0].total : 0;

		res.json({
			success: true,
			totalGames,
			totalWins,
			totalLosses,
			winRate: parseFloat(winRate.toFixed(2)),
			totalEarnings: parseFloat(totalEarnings.toFixed(4))
		});
	} catch (error) {
		console.error('Dashboard stats error:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch dashboard statistics'
		});
	}
});

router.get('/user/activity', auth.authenticateUser, async (req, res) => {
	try {
		const userId = req.user.id;
		
		// Get user data
		const user = await users.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		// Get games played count
		const gamesPlayed = await betHis.countDocuments({ userid: userId });

		// Get account age in days
		const accountAge = Math.ceil((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));

		res.json({
			success: true,
			lastLogin: user.lastLogin || user.createdAt,
			gamesPlayed,
			favoriteGames: user.favourites || [],
			accountAge
		});
	} catch (error) {
		console.error('User activity error:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch user activity'
		});
	}
});

router.get('/user/wallet-info', auth.authenticateUser, async (req, res) => {
	try {
		const userId = req.user.id;
		
		// Get user data including wallet info
		const user = await users.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		// Return wallet information
		res.json({
			success: true,
			address: user.walletAddress || '',
			type: user.walletType || 'phantom',
			isConnected: !!user.walletAddress,
			lastUpdated: user.updatedAt || user.createdAt
		});
	} catch (error) {
		console.error('Wallet info error:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch wallet information'
		});
	}
});

router.post('/user/update-activity', auth.authenticateUser, async (req, res) => {
	try {
		const userId = req.user.id;
		const { timestamp, action } = req.body;

		// Update user's last activity
		await users.findByIdAndUpdate(userId, {
			lastActivity: new Date(timestamp || Date.now()),
			lastAction: action || 'dashboard_visit'
		});

		res.json({
			success: true,
			message: 'Activity updated successfully'
		});
	} catch (error) {
		console.error('Update activity error:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to update activity'
		});
	}
});

router.get('/user/recent-games', auth.authenticateUser, async (req, res) => {
	try {
		const userId = req.user.id;
		const limit = parseInt(req.query.limit) || 5;

		// Get recent games
		const recentGames = await betHis.find({ userid: userId })
			.sort({ createdAt: -1 })
			.limit(limit)
			.select('game betAmount winAmount status createdAt')
			.lean();

		res.json({
			success: true,
			games: recentGames
		});
	} catch (error) {
		console.error('Recent games error:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch recent games'
		});
	}
});

router.get('/user/notifications', auth.authenticateUser, async (req, res) => {
	try {
		const userId = req.user.id;

		// Get user notifications
		const notifications = await notify.find({ userid: userId })
			.sort({ createdAt: -1 })
			.limit(10)
			.lean();

		res.json({
			success: true,
			notifications
		});
	} catch (error) {
		console.error('Notifications error:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch notifications'
		});
	}
});

// Email verification endpoint
router.post('/verify-registration', async (req, res) => {
	try {
		const { email, verificationCode } = req.body;
		
		if (!validator.isEmail(email) || !verificationCode) {
			return res.status(400).json({
				success: false,
				message: 'Valid email and verification code are required'
			});
		}

		// Find user with encrypted email
		const userEmail = email.toLowerCase();
		const firstEmail = encrypt.encryptNew(common.firstNewMail(userEmail));
		const secondEmail = encrypt.encryptNew(common.secondNewMail(userEmail));
		
		const userData = await users.findOne({
			luck_value: firstEmail, 
			added_value: secondEmail
		}).select('_id status verification_code verification_code_expires username wallet_address wallet_type');

		if (!userData) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		// Check if already verified
		if (userData.status === 1) {
			return res.status(400).json({
				success: false,
				message: 'Account is already verified'
			});
		}

		// Check verification code
		if (!userData.verification_code || userData.verification_code !== verificationCode) {
			return res.status(400).json({
				success: false,
				message: 'Invalid verification code'
			});
		}

		// Check if code expired
		if (!userData.verification_code_expires || userData.verification_code_expires < new Date()) {
			return res.status(400).json({
				success: false,
				message: 'Verification code has expired. Please request a new one.'
			});
		}

		// Activate the account
		await users.updateOne(
			{ _id: userData._id },
			{
				$set: { status: 1 },
				$unset: { verification_code: "", verification_code_expires: "" }
			}
		);

		// Create JWT token and auto-login
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
				walletAddress: userData.wallet_address,
				walletType: userData.wallet_type
			},
			message: 'Email verified successfully! You are now logged in.'
		});

	} catch (error) {
		console.error('Verification error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
});

// Resend verification code endpoint
router.post('/resend-verification', async (req, res) => {
	try {
		const { email } = req.body;
		
		if (!validator.isEmail(email)) {
			return res.status(400).json({
				success: false,
				message: 'Valid email is required'
			});
		}

		// Find user with encrypted email
		const userEmail = email.toLowerCase();
		const firstEmail = encrypt.encryptNew(common.firstNewMail(userEmail));
		const secondEmail = encrypt.encryptNew(common.secondNewMail(userEmail));
		
		const userData = await users.findOne({
			luck_value: firstEmail, 
			added_value: secondEmail
		}).select('_id status username');

		if (!userData) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		// Check if already verified
		if (userData.status === 1) {
			return res.status(400).json({
				success: false,
				message: 'Account is already verified'
			});
		}

		// Generate new verification code
		const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
		
		// Update verification code
		await users.updateOne(
			{ _id: userData._id },
			{
				$set: {
					verification_code: verificationCode,
					verification_code_expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
				}
			}
		);

		// Send verification email
		const specialVars = { 
			'###USER###': userData.username, 
			'###CODE###': verificationCode
		};
		
		mail.sendMail(userEmail, 'verification_mail', specialVars, function(mailRes) {	
			console.log('Verification email resent:', mailRes);
		});

		res.json({
			success: true,
			message: 'Verification code sent to your email'
		});

	} catch (error) {
		console.error('Resend verification error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
});

// Create verification email template if it doesn't exist
router.post('/setup-email-template', async (req, res) => {
	try {
		const emailtemp = require('../model/emailtemplate');
		
		// Check if verification_mail template exists
		const existingTemplate = await emailtemp.findOne({ title: 'verification_mail' });
		
		if (!existingTemplate) {
			const template = {
				title: 'verification_mail',
				mailsubject: 'Verify Your Bullana Bet Account',
				mailcontent: `
					<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
						<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
							<h1 style="color: white; margin: 0; font-size: 28px;">Bullana Bet</h1>
						</div>
						<div style="background: white; padding: 40px 20px; border-left: 4px solid #667eea;">
							<h2 style="color: #333; margin-top: 0;">Welcome ###USER###!</h2>
							<p style="color: #666; font-size: 16px; line-height: 1.6;">
								Thank you for registering with Bullana Bet. To complete your account setup and start playing, 
								please verify your email address using the code below:
							</p>
							<div style="background: #f8f9fa; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 30px 0;">
								<p style="margin: 0; color: #666; font-size: 14px;">Your Verification Code</p>
								<h1 style="margin: 10px 0; color: #667eea; font-size: 32px; letter-spacing: 4px;">###CODE###</h1>
								<p style="margin: 0; color: #999; font-size: 12px;">This code expires in 10 minutes</p>
							</div>
							<p style="color: #666; font-size: 14px; line-height: 1.6;">
								Enter this code on the verification page to activate your account and access your dashboard.
							</p>
							<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
								<p style="color: #999; font-size: 12px; margin: 0;">
									If you didn't create this account, please ignore this email.
								</p>
							</div>
						</div>
					</div>
				`
			};
			
			await emailtemp.create(template);
			res.json({ success: true, message: 'Verification email template created' });
		} else {
			res.json({ success: true, message: 'Verification email template already exists' });
		}
		
	} catch (error) {
		console.error('Template setup error:', error);
		res.status(500).json({ success: false, message: 'Failed to setup email template' });
	}
});

// Check if user already exists (for frontend validation)
router.post('/check-user-exists', async (req, res) => {
	try {
		const { email, username } = req.body;
		
		if (!email || !username) {
			return res.status(400).json({
				success: false,
				message: 'Email and username are required'
			});
		}

		// Check email validation
		if (!validator.isEmail(email)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid email format'
			});
		}

		const usermail = email.toLowerCase();
		const firstEmail = encrypt.encryptNew(common.firstNewMail(usermail));
		const secondEmail = encrypt.encryptNew(common.secondNewMail(usermail));
		
		// Check if user exists with email or username
		const existingUser = await users.findOne({
			$or: [
				{ luck_value: firstEmail, added_value: secondEmail },
				{ username: username }
			]
		}).select('_id status username');

		if (existingUser) {
			return res.json({
				success: true,
				exists: true,
				verified: existingUser.status === 1,
				message: existingUser.status === 1 
					? 'User already exists and is verified' 
					: 'User exists but is not verified'
			});
		} else {
			return res.json({
				success: true,
				exists: false,
				verified: false,
				message: 'User does not exist'
			});
		}

	} catch (error) {
		console.error('Check user exists error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
});

// DEVELOPMENT ONLY - Clear test users from database
router.post('/dev/clear-test-users', async (req, res) => {
	try {
		// Only allow in development environment
		if (process.env.NODE_ENV === 'production') {
			return res.status(403).json({
				success: false,
				message: 'This endpoint is not available in production'
			});
		}

		const { confirmationCode } = req.body;
		
		// Require confirmation code to prevent accidental deletion
		if (confirmationCode !== 'CLEAR_TEST_DATA_CONFIRM') {
			return res.status(400).json({
				success: false,
				message: 'Invalid confirmation code'
			});
		}

		// Delete test users (those with status 0 or test usernames)
		const deleteResult = await users.deleteMany({
			$or: [
				{ status: 0 }, // Unverified users
				{ username: { $regex: /^test/i } }, // Usernames starting with "test"
				{ username: { $regex: /^User_/i } } // Auto-generated usernames
			]
		});

		res.json({
			success: true,
			message: `Cleared ${deleteResult.deletedCount} test users from database`,
			deletedCount: deleteResult.deletedCount
		});

	} catch (error) {
		console.error('Clear test users error:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to clear test users'
		});
	}
});

module.exports = router;