const request = require("supertest");
const app = require("../../src/app");
const { seed } = require('../../seed/index');

beforeAll(async () => {
  await seed()
});

describe("POST /balances/deposit/:userId", function () {

  it("Call protected route without authentication", function (done) {
    request(app).post("/balances/deposit/someUser").expect(401, done);
  });

  it("Call protected route with invalid user", function (done) {
    request(app)
      .post("/balances/deposit/anotherUser")
      .set("profile_id", "ZXZQWWEEW")
      .expect(401, done);
  });

  it("Try to deposite invalid quantity of money", function (done) {
    request(app)
      .post("/balances/deposit/1")
      .set("profile_id", "1")
      .send({ value: 1000 })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toEqual('VALUE_HIGHER_THAN_YOUR_LIMIT');
      })
      .finally(done);
  });

  it("Deposite $50 and receive a correct balance", function (done) {
    request(app)
      .post("/balances/deposit/5")
      .set("profile_id", "5")
      .send({ value: 23 })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.balance).toEqual(87);
      })
      .finally(done);
  });
});
