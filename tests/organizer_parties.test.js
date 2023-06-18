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

// First we need to login to get the token
let token = "";
describe("POST /api/v1/auth/login", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      username: "test",
      password: "test",
    });
    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });
});

// Then we can make the various requests
describe("GET /api/v1/parties/organizers/", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/api/v1/parties/organizers").send().set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    });
  it("should return 401 Unauthorized", async () => {
    const res = await request(app).get("/api/v1/parties/organizers").send();
    expect(res.statusCode).toBe(401);
    }
  );
});

// Create a party 
let party_id = "";
describe("POST /api/v1/parties/organizers/", () => {
  it("should return 201 Party created successfully", async () => {
    const res = await request(app).post("/api/v1/parties/organizers").send({
      name: "test party",
      description: "test description",
      tags: ["test", "test2"],
      location: "test location",
      date: "19-06-2023 12:30",
      max_participants: 10
    }).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(201);
    party_id = res.body._id;
  });
  it("should return 401 Unauthorized", async () => {
    const res = await request(app).post("/api/v1/parties/organizers").send({
      name: "test party",
      description: "test description",
      tags: ["test", "test2"],
      location: "test location",
      date: "19-06-2023 12:30",
      max_participants: 10
    });
    expect(res.statusCode).toBe(401);
  });
});


// Get the party we just created
describe("GET /api/v1/parties/organizers/:id", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get(`/api/v1/parties/organizers/${party_id}`).send().set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  it("should return 401 Unauthorized", async () => {
    const res = await request(app).get(`/api/v1/parties/organizers/${party_id}`).send();
    expect(res.statusCode).toBe(401);
  });
  it("should return 404 Not Found", async () => {
    const res = await request(app).get(`/api/v1/parties/organizers/123456789012345678901234`).send().set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});


server.close();
