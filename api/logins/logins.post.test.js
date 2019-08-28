const {
	chai, server, baseUrl, User,
	password, hash, bio,
	username, email, token,
	username2, email2, token2,
} = require('../test.setup');

beforeEach(async () => {
	await User.deleteMany({}); // empty the users collection
});

describe('POST /logins', () => {

	describe('when the user exist', () => {
		beforeEach(async () => {
			await User.create({ username, email, hash });
		});

		it('should return a token and the user (public and private fields)', async () => {
			const res = await chai.request(server)
				.post(`${baseUrl}/logins`)
				.send({ user: { username, email, password } })
			expect(res).to.have.status(200);
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('token');
			expect(res.body.token).to.be.a('string');
			expect(res.body).to.have.property('user');
			expect(res.body.user).to.deep.equal({ username, email });
		})
	})

})
