const {
	chai, server, baseUrl, User,
	password, hash, bio,
	username, email, token,
	username2, email2, token2,
} = require('../test.setup');

beforeEach(async () => {
	await User.deleteMany({}); // empty the users collection
});

describe('POST /users', () => {

	describe('when the user is new', () => {
		it('should return a token and the user (public and private fields)', async () => {
			const res = await chai.request(server)
				.post(`${baseUrl}/users`)
				.send({ user: { username, email, password }});
			expect(res).to.have.status(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('token');
			expect(res.body.token).to.be.a('string');
			expect(res.body).to.have.property('user');
			expect(res.body.user).to.deep.equal({ username, email });
		})
	})

	describe('when the body is not correct JSON', () => {
		it('should fail', async () => {
			const res = await chai.request(server)
				.post(`${baseUrl}/users`)
				.set('Content-Type', 'application/json')
				.send('***wong***');
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({ errors: {"body": "cannot be parsed"} });
		});
	});

	describe('when the user is missing from the body', () => {
		it('should fail', async () => {
			const res = await chai.request(server)
				.post(`${baseUrl}/users`)
				.send({});
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({ errors: {"user": "is missing"} });
		});
	});

	describe('when the password is missing from the body', () => {
		it('should fail', async () => {
			const res = await chai.request(server)
				.post(`${baseUrl}/users`)
				.send({ user: { username, email }});
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({ errors: {"password": "is missing"} });
		});
	});

	describe('when the username or email is missing from the body', () => {
		it('should fail', async () => {
			const res = await chai.request(server)
				.post(`${baseUrl}/users`)
				.send({ user: { password }});
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({ errors: {
				"username": "is missing",
				"email": "is missing"
			}});
		});
	});

	describe('when the username or email is invalid', () => {
		it('should fail', async () => {
			const res = await chai.request(server)
				.post(`${baseUrl}/users`)
				.send({
					user: { username: "***invalid***", email: "***invalid***", password }
				});
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({ errors: {
				"username": "is invalid",
				"email": "is invalid"
			}});
		});
	});

	describe('when the username or password is already taken by another user', () => {
		beforeEach(async () => {
			await User.create({ username, email, hash });
		});

		it('should fail', async () => {
			const res = await chai.request(server)
				.post(`${baseUrl}/users`)
				.send({ user: { username, email, password }});
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({ errors: {
				"username": "is already taken",
				"email": "is already taken"
			}});
		});
	});

});
