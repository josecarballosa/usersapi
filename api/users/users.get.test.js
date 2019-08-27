const {
	chai, server, baseUrl, User,
	password, hash, bio,
	username, email, token,
	username2, email2, token2,
} = require('./users.test.setup');

beforeEach(async () => {
	await User.deleteMany({}); // empty the users collection
});

describe('GET /users', () => {

	describe('when users exist', () => {
		beforeEach(async () => {
			await User.create([
				{ username, email },
				{ username: username2, email: email2 }
			]);
		});

		it('should return all users (only public fields)', async () => {
			const res = await chai.request(server)
				.get(`${baseUrl}/users`);
			expect(res).to.have.status(200);
			expect(res.body).to.deep.equal({
				users: [ { username }, { username: username2 } ]
			});
		})
	})

	describe('when no user exist', () => {
		it('should return an empty list', async () => {
			const res = await chai.request(server)
				.get(`${baseUrl}/users`);
			expect(res).to.have.status(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('users');
			expect(res.body.users).to.be.an('array').that.is.empty;
		})
	})

})

describe('GET /users/:id', () => {

	describe('when the user exist', () => {
		beforeEach(async () => {
			await User.create([
				{ username, email, hash },
				{ username: username2, email: email2, hash }
			]);
		});

		describe('and the request is authenticated', () => {
			describe('and the requested user is the authenticated user', () => {
				it('should return the user (public and private fields)', async () => {
					const res = await chai.request(server)
						.get(`${baseUrl}/users/piet`)
						.set('Authorization', `Bearer ${token}`);
					expect(res).to.have.status(200);
					expect(res.body).to.deep.equal({ user: { username, email }});
				})
			})

			describe('and the requested user is not the authenticated user', () => {
				it('should return the user (only public fields)', async () => {
					const res = await chai.request(server)
						.get(`${baseUrl}/users/piet`)
						.set('Authorization', `Bearer ${token2}`);
					expect(res).to.have.status(200);
					expect(res.body).to.deep.equal({ user: { username }});
				})
			})
		})

		describe('and the request is not authenticated', () => {
			it('should return the user (only public fields)', async () => {
				const res = await chai.request(server)
					.get(`${baseUrl}/users/piet`);
				expect(res).to.have.status(200);
				expect(res.body).to.deep.equal({ user: { username }});
			})
		})

	})

})
