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

describe('GET /users', () => {
	describe('when there are users', () => {
		beforeEach(async () => {
			await User.create([
				{ username, email, hash },
				{ username: username2, email: email2, hash },
			]);
		});

		it('should return all users (only public fields)', async () => {
			const res = await chai.request(server).get(`${baseUrl}/users`);
			expect(res).to.have.status(200);
			expect(res.body).to.deep.equal({
				users: [{ username }, { username: username2 }],
			});
		});
	});

	describe('when there are no users', () => {
		it('should return an empty list', async () => {
			const res = await chai.request(server).get(`${baseUrl}/users`);
			expect(res).to.have.status(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('users');
			expect(res.body.users).to.be.an('array').that.is.empty;
		});
	});
});

describe('GET /users/:username', () => {
	beforeEach(async () => {
		await User.create([{ username, email, hash }]);
	});

	describe('when the requested user is the authenticated user', () => {
		it('should return the user public and private fields', async () => {
			const res = await chai
				.request(server)
				.get(`${baseUrl}/users/piet`)
				.set('Authorization', `Bearer ${token}`);
			expect(res).to.have.status(200);
			expect(res.body).to.deep.equal({ user: { username, email } });
		});
	});

	describe('when the requested user is not the authenticated user', () => {
		beforeEach(async () => {
			await User.create([{ username: username2, email: email2, hash }]);
		});

		it('should return the user public fields', async () => {
			const res = await chai
				.request(server)
				.get(`${baseUrl}/users/piet`)
				.set('Authorization', `Bearer ${token2}`);
			expect(res).to.have.status(200);
			expect(res.body).to.deep.equal({ user: { username } });
		});
	});

	describe('when the request has no authentication', () => {
		it('should return the user public fields', async () => {
			const res = await chai.request(server).get(`${baseUrl}/users/piet`);
			expect(res).to.have.status(200);
			expect(res.body).to.deep.equal({ user: { username } });
		});
	});

	describe('when the authentication token is invalid', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.get(`${baseUrl}/users/piet`)
				.set('Authorization', `Bearer wrong`);
			expect(res).to.have.status(401);
			expect(res.body).to.deep.equal({
				message: 'invalid authentication',
				errors: { token: 'jwt malformed' },
			});
		});
	});

	describe('when the authentication username is unknown', () => {
		it('should fail', async () => {
			const res = await chai
				.request(server)
				.get(`${baseUrl}/users/piet`)
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
			const res = await chai.request(server).get(`${baseUrl}/users/unknown`);
			expect(res).to.have.status(404);
			expect(res.body).to.deep.equal({
				message: 'invalid user data',
				errors: { username: 'is unknown' },
			});
		});
	});
});
