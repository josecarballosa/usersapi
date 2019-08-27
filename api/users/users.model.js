const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const { saltRounds } = require('../config');
// const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
		username: {
			type: String,
			lowercase: true,
			required: [true, "can't be blank"],
			match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
			unique: true,
			index: true,
		},
		email: {
			type: String,
			lowercase: true,
			required: [true, "can't be blank"],
			match: [/\S+@\S+\.\S+/, 'is invalid'],
			unique: true,
			index: true,
		},
		bio: String,
		image: String,
		hash: String,
		//salt: String, // bcrypt generates and prepends salt to hash
	},
	{ timestamps: true }
);

UserSchema.plugin(uniqueValidator, {
	message: 'is already taken'
});

UserSchema.methods.setPassword = /*async*/ function(password) {
// 	this.salt = crypto.randomBytes(16).toString('hex');
//   this.hash = crypto.pbkdf2Sync(password, this.salt, 10000,512,'sha512').toString('hex');
	this.hash = bcrypt.hashSync(password, saltRounds);
	// console.log('hash:', this.hash);
}

UserSchema.methods.checkPassword = function (password) {
	//   const hash = crypto.pbkdf2Sync(password, this.salt, 10000,512,'sha512').toString('hex');
	//   return this.hash === hash;
	return bcrypt.compareSync(password, this.hash);
}

UserSchema.methods.toJSON = function (includePrivateData) {
	return {
		username: this.username,
		bio: this.bio,
		image: this.image,

		...includePrivateData && {
			email: this.email, // phone_number, etc...
		}
	};
}

module.exports = mongoose.model('User', UserSchema);