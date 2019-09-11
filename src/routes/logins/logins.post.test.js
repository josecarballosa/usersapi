const {
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
} = require('../test.setup');

beforeEach(async () => {
	await User.deleteMany({}); // empty the users collection
});

describe('POST /logins', () => {
	describe('when the user exist', () => {
		beforeEach(async () => {
			await User.create({ username, email, hash });
		});

		it('should return a token and the user public and private fields', async () => {
			const res = await chai
				.request(server)
				.post(`${baseUrl}/logins`)
				.send({ user: { username, password } });
			expect(res).to.have.status(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('token');
			expect(res.body.token).to.be.a('string');
			expect(res.body).to.have.property('user');
			expect(res.body.user).to.deep.equal({ username, email });
		});
	});

	describe('when the body is not correct JSON', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.post(`${baseUrl}/logins`)
				.set('Content-Type', 'application/json')
				.send('***wong***');
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({
				message: 'invalid data',
				errors: { body: 'is malformed' },
			});
		});
	});

	describe('when the user is missing from the body', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.post(`${baseUrl}/logins`)
				.send({});
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({
				message: 'invalid user data',
				errors: { user: 'is missing' },
			});
		});
	});

	describe('when the username is missing from the body', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.post(`${baseUrl}/logins`)
				.send({ user: { password } });
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({
				message: 'invalid user data',
				errors: { username: 'is missing' },
			});
		});
	});

	describe('when the password is missing from the body', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.post(`${baseUrl}/logins`)
				.send({ user: { username } });
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({
				message: 'invalid user data',
				errors: { password: 'is missing' },
			});
		});
	});

	describe('when the username is unknown', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.post(`${baseUrl}/logins`)
				.send({ user: { username, password } });
			expect(res).to.have.status(401);
			expect(res.body).to.deep.equal({
				message: 'invalid authentication',
				errors: { 'username or password': 'is invalid' },
			});
		});
	});

	describe('when the password is wrong', () => {
		beforeEach(async () => {
			await User.create({ username, email, hash });
		});

		it('should fail', async () => {
			const res = await chai
				.request(server)
				.post(`${baseUrl}/logins`)
				.send({ user: { username, password: 'wrong' } });
			expect(res).to.have.status(401);
			expect(res.body).to.deep.equal({
				message: 'invalid authentication',
				errors: { 'username or password': 'is invalid' },
			});
		});
	});
});
