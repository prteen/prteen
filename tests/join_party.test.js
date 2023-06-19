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
    token = res.body.access_token;
  });
});

let test1_token = "";
describe("POST /api/v1/auth/login", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      username: "test1",
      password: "test1",
    });
    expect(res.statusCode).toBe(200);
    test1_token = res.body.access_token;
  });
});


// Create a party 
let party_id = "";
describe("POST /api/v1/parties/organizers/", () => {
  it("should return 201 Party created successfully", async () => {
    const res = await request(app).post("/api/v1/parties/organizers").send({
      name: "test party",
      description: "test description",
      image: null,
      tags: ["test", "test2"],
      location: "test",
      date: null,
      max_participants: 10,
      participants: [],
      private: false
    }).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(201);
    party_id = res.body.id;
  });
});

describe("PUT /api/v1/parties/join/:id", () => {
  // send unexisting action 
  it("should return 400 Invalid action", async () => {
    const res = await request(app).put(`/api/v1/parties/join/${party_id}`).send({
      action: "unexisting"
    }).set("Authorization", `Bearer ${test1_token}`);
    expect(res.statusCode).toBe(400);
  });

  // Join a party as test1
  it("should return 200 OK", async () => {
    const res = await request(app).put(`/api/v1/parties/join/${party_id}`).send({
      action: "join"
    }).set("Authorization", `Bearer ${test1_token}`);
    expect(res.statusCode).toBe(200);
  });
});

// delete the party 
describe("DELETE /api/v1/parties/organizers/:id", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).delete(`/api/v1/parties/organizers/${party_id}`).send().set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

// create another party with 0 max_participants
describe("POST /api/v1/parties/organizers/", () => {
  it("should return 201 Party created successfully", async () => {
    const res = await request(app).post("/api/v1/parties/organizers").send({
      name: "test party",
      description: "test description",
      image: null,
      tags: ["test", "test2"],
      location: "test",
      date: null,
      max_participants: 0,
      participants: [],
      private: false
    }).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(201);
    party_id = res.body.id;
  });
});

// try joining a full party 
describe("PUT /api/v1/parties/join/:id", () => {
  it("should return 409 Party is full", async () => {
    const res = await request(app).put(`/api/v1/parties/join/${party_id}`).send({
      action: "join"
    }).set("Authorization", `Bearer ${test1_token}`);
    expect(res.statusCode).toBe(409);
  });
});

// delete the party 
describe("DELETE /api/v1/parties/organizers/:id", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).delete(`/api/v1/parties/organizers/${party_id}`).send().set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});


server.close();
