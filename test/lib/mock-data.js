const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid');
const userService = require('../../src/user/index')

class MockData {
  /**
   * @method uuid
   */
  uuid() {
    return uuidv4(...arguments)
  }

  /**
   * @method hash
   */
  hash(input) {
    return bcrypt.hash(input, authService.SALT_WORK_FACTOR)
  }

  /**
   * @method mockAuthAndUser
   */
  async mockAuthAndUser(options = {}) {
    const user = await this.mockUser(options)
    const auth = await this.mockAuth({ ...options, user: user.id })
    return auth
  }

  /**
   * @method mockAuth
   */
  mockAuth(options = {}) {
    const data = Object.assign(
      {
        token: uuid(),
        user: uuid(),
        password: uuid()
      },
      options
    )
    return authService.create(data)
  }

  /**
   * @method mockUser
   */
  mockUser(options = {}) {
    const data = Object.assign(
      {
        email: `${uuid()}@test.com`,
        userName: 'John',
        password: 'Doe',
      },
      options
    )
    return userService.create(data)
  }
}

module.exports = new MockData()