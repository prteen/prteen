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

describe("GET /api/v1/parties", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/api/v1/parties");
    expect(res.statusCode).toBe(200);
  }); 
});


const party_id = "";
describe("GET /api/v1/parties/:id", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get(`/api/v1/parties/${party_id}`);
    expect(res.statusCode).toBe(200);
  });
  it("should return 404 Not Found", async () => {
    const res = await request(app).get("/api/v1/parties/notfound");
    expect(res.statusCode).toBe(404);
  });
});

server.close();
