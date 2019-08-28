const {
	chai, server, baseUrl, User,
	password, hash, bio,
	username, email, token,
	username2, email2, token2,
} = require('../test.setup');

beforeEach(async () => {
	await User.deleteMany({}); // empty the users collection
});

describe('DELETE /users/:id', () => {

	describe('when the user exist', () => {
		beforeEach(async () => {
			await User.create({ username, email, hash });
		});

		describe('and the request is authenticated', () => {
			describe('and the requested user is the authenticated user', () => {
				it('should return the user (public and private fields)', async () => {
					const res = await chai.request(server)
						.delete(`${baseUrl}/users/piet`)
						.set('Authorization', `Bearer ${token}`);
					expect(res).to.have.status(200);
					expect(res.body).to.deep.equal({ user: { username, email }});
				})
			})
		})
	})
})