var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var emailtemp = require('../model/emailtemplate');

var transporter = nodemailer.createTransport({
	host: 'smtp.zoho.in',
 	port: '465',
	secure: true,
	auth: {
		user: 'smtp@hivelance.com',
		pass: 'LFc7JqDE5gnB'
	}
});

module.exports = {
	sendMail : function(to, tempName, specialVar, callback) {
		emailtemp.find({ "title": tempName }).exec(function(etemperr,tempContent) {
			specialVars = specialVar;
			var subject = tempContent[0].mailsubject;
			var html = tempContent[0].mailcontent;
			for( var key in specialVars ) {
				if( specialVars.hasOwnProperty( key ) ) {
					subject = subject.replace( key, specialVars[ key ] );
				}
			}
			for( var key in specialVars ) {
				if( specialVars.hasOwnProperty( key ) ) {
					html = html.replace( key, specialVars[ key ] )
				}
			}
			let mailOptions = {
				from: '"ROLL GAME" <smtp@hivelance.com>',
				to: to,
				subject: subject,
				html: html
			}; 			

			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log('Email error:' + error);
				}
				callback(true);
			});
		});
	}
};