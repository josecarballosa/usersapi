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

describe('DELETE /users/:username', () => {
	beforeEach(async () => {
		await User.create({ username, email, hash });
	});

	describe('when the requested user is the authenticated user', () => {
		it('should return the user public and private fields', async () => {
			const res = await chai
				.request(server)
				.delete(`${baseUrl}/users/piet`)
				.set('Authorization', `Bearer ${token}`);
			expect(res).to.have.status(200);
			expect(res.body).to.deep.equal({ user: { username, email } });
		});
	});

	describe('when the request has no authentication', () => {
		it('should fail', async () => {
			const res = await chai.request(server).delete(`${baseUrl}/users/piet`);
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
				.delete(`${baseUrl}/users/piet`)
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
				.delete(`${baseUrl}/users/piet`)
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
				.delete(`${baseUrl}/users/unknown`)
				.set('Authorization', `Bearer ${token}`);
			expect(res).to.have.status(404);
			expect(res.body).to.deep.equal({
				message: 'invalid user data',
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
				.delete(`${baseUrl}/users/piet`)
				.set('Authorization', `Bearer ${token2}`);
			expect(res).to.have.status(403);
			expect(res.body).to.deep.equal({
				message: 'invalid authorization',
				errors: { user: 'is wrong' },
			 });
		});
	});
});
