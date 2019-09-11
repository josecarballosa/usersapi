process.env.NODE_ENV = 'test'; // force environment to be "test"

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/server');

expect = chai.expect;
chai.use(chaiHttp);

const baseUrl = '';

const User = require('../src/routes/users/users.model');

const password = 'Password1';
const hash = '$2b$10$C/WokEN/X0UXPkBgfKped.mmr7GJYbo7BrTdUyaEp7jT1kODma3Pe';

const username = 'piet';
const email = 'piet@yahoo.com';
const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBpZXQiLCJpYXQiOjE1NjgxOTM1ODEsImV4cCI6MTU5OTcyOTU4MX0.jxQ78UEoa2Wj6skBvKlTaFBQ8HJXawdgpXRRIVp6rKY';

const username2 = 'piet2';
const email2 = 'piet2@yahoo.com';
const token2 =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBpZXQyIiwiaWF0IjoxNTY4MTkzNjIwLCJleHAiOjE1OTk3Mjk2MjB9.KAh-86rtx2_aCagn561JOR7_UsYq-rHA3QsvY9CUs64';

/*
curl -i -X POST http://localhost:8626/logins -H "content-type: application/json" -d "{\"user\":{\"username\":\"piet\", \"password\":\"Password1\"}}"

curl -i -X POST http://localhost:8626/logins -H "content-type: application/json" -d "{\"user\":{\"username\":\"piet2\", \"password\":\"Password1\"}}"
*/

const bio = 'superhero';

module.exports = {
	chai,
	server,
	baseUrl,
	User,
	password,
	hash,
	bio,
	username,
	email,
	token,
	username2,
	email2,
	token2,
};
