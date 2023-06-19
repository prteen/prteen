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

describe("POST /api/v1/auth/login", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      username: "test",
      password: "test",
    });
    expect(res.statusCode).toBe(200);
  });
  it("should return 404 User Not Found", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      username: "user",
      password: "passw",
    });
    expect(res.statusCode).toBe(404);
  });
  it("should return 400 Missing Username or Password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      username: "test",
    });
    expect(res.statusCode).toBe(400);
  });
  it("should return 400 Missing Username or Password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      password: "test",
    });
    expect(res.statusCode).toBe(400);
  });
  it("should return 401 Incorrect Password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      username: "test",
      password: "wrong",
    });
    expect(res.statusCode).toBe(401);
  });
});

server.close();
