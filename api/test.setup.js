const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../server');

expect = chai.expect;
chai.use(chaiHttp);

const baseUrl = '/api/v1';

const User = require('./users/users.model');

const password = 'Password1';
const hash = '$2b$10$C/WokEN/X0UXPkBgfKped.mmr7GJYbo7BrTdUyaEp7jT1kODma3Pe';

const username = 'piet';
const email = 'piet@yahoo.com';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBpZXQiLCJpYXQiOjE1NjY5MTM2MjgsImV4cCI6MTU2NzA4NjQyOH0.cYGuRU2SwvWAaKMWbiVN17qj5I5B9PaZgcx2Jnx82Ao';

const username2 = 'piet2';
const email2 = 'piet2@yahoo.com';
const token2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBpZXQyIiwiaWF0IjoxNTY2OTE4NTI4LCJleHAiOjE1NjcwOTEzMjh9.9JYzCpHPy37qbeORbX89vFKCAEt8lImw2JIDlouNSw0';

const bio = 'superhero';

module.exports = {
	chai, server, baseUrl, User,
	password, hash, bio,
	username, email, token,
	username2, email2, token2,
}
