const {
	chai, server, baseUrl, User,
	password, hash, bio,
	username, email, token,
	username2, email2, token2,
} = require('./users.test.setup');

beforeEach(async () => {
	await User.deleteMany({}); // empty the users collection
});

describe('PUT /users/:id', () => {

	describe('when the user exist', () => {
		beforeEach(async () => {
			await User.create({ username, email, hash });
		});

		describe('and the request is authenticated', () => {
			describe('and the requested user is the authenticated user', () => {
				it('should return the user (public and private fields)', async () => {
					const res = await chai.request(server)
						.put(`${baseUrl}/users/piet`)
						.set('Authorization', `Bearer ${token}`)
						.send({ user: { bio }});
					expect(res).to.have.status(200);
					expect(res.body).to.deep.equal({ user: { username, email, bio }});
				})
			})

			// describe('and the requested user is not the authenticated user', () => {
			// 	it('should fail')
			// })
		})

		// describe('and the request is not authenticated', () => {
		// 	it('should fail')
		// })

	})
})
