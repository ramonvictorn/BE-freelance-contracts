const request = require("supertest");
const app = require("../../src/app");
const { seed } = require('../../seed/index');

beforeAll(async () => {
  console.log(seed, 'seed')
  await seed()
  console.log('----------------- FINISHED -----------------------------')
});

describe("GET /contracts", function () {

  it("Call protected route without authentication", function (done) {
    request(app).get("/contracts").expect(401, done);
  });

  it("Call protected route with invalid user", function (done) {
    request(app)
      .get("/contracts")
      .set("profile_id", "ZXZQWWEEW")
      .expect(401, done);
  });

  it("Get all contracts from a user", function (done) {
    const contractToFind = {
      id: 3,
      terms: "bla bla bla",
      status: "in_progress",
      ContractorId: 6,
      ClientId: 2,
    };

    request(app)
      .get("/contracts")
      .set("profile_id", "6")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.count).toBe(3);
        expect(response.body.data.rows).toEqual(
          expect.arrayContaining([
            expect.objectContaining({id: contractToFind.id}),
            expect.objectContaining({terms: contractToFind.terms}),
            expect.objectContaining({status: contractToFind.status}),
            expect.objectContaining({ContractorId: contractToFind.ContractorId}),
            expect.objectContaining({ClientId: contractToFind.ClientId}),
          ])
        );
      })
      .finally(done);
  });
});
