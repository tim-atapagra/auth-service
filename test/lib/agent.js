const request = require("supertest");
const app = require("../../src/index");

class Agent {
  async start() {
    this.app = app.listen();
  }

  client() {
    return request(app);
  }
}

module.exports = new Agent();
