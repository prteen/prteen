const request = require("supertest");
const { app, server } = require("../app/app_test");

const connect = require("../db/mongodb").connect;
const disconnect = require("../db/mongodb").disconnect;

require("dotenv").config();

beforeEach(async () => {
  await connect()
});

afterEach(async () => {
  await disconnect()
});

// First we need to login to get a token
let token = "";
describe("POST /api/v1/auth/login", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      username: "test",
      password: "test",
    });
    expect(res.statusCode).toBe(200);
    token = res.body.access_token;
  });
});

// Now we can use the token to access the protected routes
describe("GET /api/v1/parties/users", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/api/v1/parties/users").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  it("should return 401 Unauthorized", async () => {
    const res = await request(app).get("/api/v1/parties/users");
    expect(res.statusCode).toBe(401);
  });
});


server.close();
