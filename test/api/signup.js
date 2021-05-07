const app = require("../../src");
const request = require("supertest");

let should;
// eslint-disable-next-line no-unused-vars
let agent;
let mockData;

before(() => {
  should = require("should");
  agent = require("../lib/agent");
  mockData = require("../lib/mock-data");
});

describe("api", () => {
  describe("signup", () => {
    it("should signup a user", async () => {
      const body = {
        userName: mockData.uuid(),
        password: mockData.uuid(),
        email: `${mockData.uuid()}@test.com`,
        phoneNumber: mockData.uuid(),
        token: mockData.uuid()
      };

      const res = request(app)
        .post("/signup")
        .send(body);

      should.exist(res._data.userName);
      should.exist(res._data.password);
      res._data.email.should.equal(body.email);
      res._data.userName.should.equal(body.userName);
      res._data.phoneNumber.should.equal(body.phoneNumber);
    });
  });
});
