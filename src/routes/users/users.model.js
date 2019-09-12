const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const { saltRounds } = require('../../utils/settings');
// const crypto = require('crypto');
const logger = require('../../config/winston');

logger.info('creating the database schema for users');
const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			lowercase: true,
			required: [true, 'is missing'],
			match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
			unique: true,
			index: true,
		},
		email: {
			type: String,
			lowercase: true,
			required: [true, 'is missing'],
			match: [/\S+@\S+\.\S+/, 'is invalid'],
			unique: true,
			index: true,
		},
		bio: String,
		image: String,
		hash: String,
		//salt: String, // bcrypt generates and prepends salt to hash
	},
	{ timestamps: true },
);

logger.info('attaching the unique validator to the database  schema for users');
UserSchema.plugin(uniqueValidator, {
	message: 'is already taken',
});

UserSchema.methods.setPassword = /*async*/ function(password) {
	logger.info('setting the user password (hash)');
	this.hash = bcrypt.hashSync(password, saltRounds);
};

UserSchema.methods.checkPassword = function(password) {
	logger.info('checking the user password (hash)');
	return bcrypt.compareSync(password, this.hash);
};

UserSchema.methods.toJSON = function(includePrivateData) {
	logger.info('converting a user to a simple JSON object');

	return {
		username: this.username,
		bio: this.bio,
		image: this.image,

		...(includePrivateData && {
			email: this.email, // phone_number, etc...
		}),
	};
};

module.exports = mongoose.model('User', UserSchema);
