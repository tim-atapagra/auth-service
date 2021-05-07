const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const userService = require("../../src/user/index");

class MockData {
  /**
   * @method uuid
   */
  uuid() {
    return uuidv4(...arguments);
  }

  /**
   * @method hash
   */
  hash(input) {
    return bcrypt.hash(input, userService.SALT_WORK_FACTOR);
  }

  /**
   * @method mockAuthAndUser
   */
  async mockAuthAndUser(options = {}) {
    const user = await this.mockUser(options);
    const auth = await this.mockAuth({ ...options, user: user.id });
    return auth;
  }
}

module.exports = new MockData();
