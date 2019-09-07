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

describe('PUT /users/:username', () => {
	beforeEach(async () => {
		await User.create({ username, email, hash });
	});

	describe('when the requested user is the authenticated user', () => {
		it('should return the user public and private fields', async () => {
			const res = await chai
				.request(server)
				.put(`${baseUrl}/users/piet`)
				.set('Authorization', `Bearer ${token}`)
				.send({ user: { bio } });
			expect(res).to.have.status(200);
			expect(res.body).to.deep.equal({ user: { username, email, bio } });
		});
	});

	describe('when the request has no authentication', () => {
		it('should fail', async () => {
			const res = await chai.request(server).put(`${baseUrl}/users/piet`);
			expect(res).to.have.status(401);
			expect(res.body).to.deep.equal({
				message: 'invalid authentication',
				errors: { token: 'No authorization token was found' },
			});
		});
	});

	describe('when the authentication token is invalid', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.put(`${baseUrl}/users/piet`)
				.set('Authorization', `Wrong ${token2}`);
			// .set('Authorization', `Bearer wrong`);
			// .set('Authorization', `${token2}`);
			expect(res).to.have.status(401);
			expect(res.body).to.deep.equal({
				message: 'invalid authentication',
				errors: { token: 'Format is Authorization: Bearer [token]' },
			});
		});
	});

	describe('when the authentication username is unknown', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.put(`${baseUrl}/users/piet`)
				.set('Authorization', `Bearer ${token2}`);
			expect(res).to.have.status(401);
			expect(res.body).to.deep.equal({
				message: 'invalid authentication',
				errors: { username: 'is unknown' },
			});
		});
	});

	describe('when the request username is unknown', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.put(`${baseUrl}/users/unknown`)
				.set('Authorization', `Bearer ${token}`);
			expect(res).to.have.status(404);
			expect(res.body).to.deep.equal({
				message: 'invalid user',
				errors: { username: 'is unknown' },
			});
		});
	});

	describe('when the requested user is not the authenticated user', () => {
		beforeEach(async () => {
			await User.create([{ username: username2, email: email2, hash }]);
		});

		it('should fail', async () => {
			const res = await chai
				.request(server)
				.put(`${baseUrl}/users/piet`)
				.set('Authorization', `Bearer ${token2}`);
			expect(res).to.have.status(403);
			expect(res.body).to.deep.equal({
				message: 'invalid authorization',
				errors: { user: 'is wrong' },
			});
		});
	});

	describe('when the body is not correct JSON', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.put(`${baseUrl}/users/piet`)
				.set('Authorization', `Bearer ${token}`)
				.set('Content-Type', 'application/json')
				.send('***wong***');
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({
				message: 'invalid user data',
				errors: { body: 'is malformed' },
			});
		});
	});

	describe('when the user is missing from the body', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.put(`${baseUrl}/users/piet`)
				.set('Authorization', `Bearer ${token}`)
				.send({});
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({
				message: 'invalid user data',
				errors: { user: 'is missing' },
			});
		});
	});

	describe('when the username or email is invalid', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.put(`${baseUrl}/users/piet`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					user: { username: '***invalid***', email: '***invalid***' },
				});
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({
				message: 'invalid user data',
				errors: {
					username: 'is invalid',
					email: 'is invalid',
				},
			});
		});
	});

	describe('when the username or password is already taken by another user', () => {
		beforeEach(async () => {
			await User.create({ username: username2, email: email2, hash });
		});

		it('should fail', async () => {
			const res = await chai
				.request(server)
				.put(`${baseUrl}/users/piet`)
				.set('Authorization', `Bearer ${token}`)
				.send({ user: { username: username2, email: email2 } });
			expect(res).to.have.status(400);
			expect(res.body).to.deep.equal({
				message: 'invalid user data',
				errors: {
					username: 'is already taken',
					email: 'is already taken',
				},
			});
		});
	});
});
