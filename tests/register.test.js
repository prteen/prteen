
const request = require("supertest");
const { app, server } = require("../app/app_test");

const connect = require("../db/mongodb").connect;
const disconnect = require("../db/mongodb").disconnect;

require("dotenv").config();

beforeEach(async () => {
  await connect()
});

/* Closing database connection after each test. */
afterEach(async () => {
  await disconnect()
});

describe("POST /api/v1/auth/register", () => {
  it("should return 201 User Created Successfully", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      username: "test",
      password: "test",
      email: "test1@test.com"
    });
    expect(res.statusCode).toBe(201);
  });
  it("should return 400 Missing Username or Password", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      password: "test",
    });
    expect(res.statusCode).toBe(400);
  });
  it("should return 400 Missing Username or Password", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      username: "test",
    });
    expect(res.statusCode).toBe(400);
  });
  it("should return 409 User Already Exists", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      username: "test1",
      password: "test",
      email: "test1@test.com"
    });
    expect(res.statusCode).toBe(409);
  });
});

server.close();
