process.env.NODE_ENV = 'test';	// force environment to be "test"

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../server');

expect = chai.expect;
chai.use(chaiHttp);

const baseUrl = '/api';

const User = require('./users/users.model');

const password = 'Password1';
const hash = '$2b$10$C/WokEN/X0UXPkBgfKped.mmr7GJYbo7BrTdUyaEp7jT1kODma3Pe';

const username = 'piet';
const email = 'piet@yahoo.com';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBpZXQiLCJpYXQiOjE1Njc4NDc4MzQsImV4cCI6MTU2ODAyMDYzNH0.-VlbWX2hitNxw0Qiy0BtYGndiY_iaaC1PCDtEp8w5zs';

const username2 = 'piet2';
const email2 = 'piet2@yahoo.com';
const token2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBpZXQyIiwiaWF0IjoxNTY3ODQ3ODgzLCJleHAiOjE1NjgwMjA2ODN9.cENs1I7wUyKi0XQsvvdlkjo5agVcQ8amVZv7r7ICnYA';

/*
curl -i -X POST http://localhost:8626/api/logins -H "content-type: application/json" -d "{\"user\":{\"username\":\"piet\", \"password\":\"Password1\"}}"

curl -i -X POST http://localhost:8626/api/logins -H "content-type: application/json" -d "{\"user\":{\"username\":\"piet2\", \"password\":\"Password1\"}}"
*/

const bio = 'superhero';

module.exports = {
	chai, server, baseUrl, User,
	password, hash, bio,
	username, email, token,
	username2, email2, token2,
}
