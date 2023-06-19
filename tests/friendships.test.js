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

// Now we can use the token to access the protected routes
describe("GET /api/v1/friendships", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/api/v1/friendships").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  it("should return 401 Unauthorized", async () => {
    const res = await request(app).get("/api/v1/friendships");
    expect(res.statusCode).toBe(401);
  });
});

// Create a friendship 
let friendship_id = "";
let friendship_id2 = "";
describe("POST /api/v1/friendships", () => {
  // create friendship with test1
  it("should return 200 Friendship created successfully", async () => {
    const res = await request(app).post("/api/v1/friendships").send({
      to: "test1",
    }).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    friendship_id = res.body.id;
  });

  // try sending another request to the same user
  it("should return 409 Friendship already exists", async () => {
    const res = await request(app).post("/api/v1/friendships").send({
      to: "test1",
    }).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(409);
  });

  // try updating the friendship request as the user who sent it
  it("should return 403 Forbidden", async () => {
    const res = await request(app).put(`/api/v1/friendships/${friendship_id}`).send({
      status: "invalid",
    }).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });

  // send invalid status to the friendship request
  it("should return 400 Invalid status", async () => {
    const res = await request(app).put(`/api/v1/friendships/${friendship_id}`).send({
      status: "invalid",
    }).set("Authorization", `Bearer ${test1_token}`);
    expect(res.statusCode).toBe(400);
  });

  // accept the friendship request
  it("should return 200 Friendship request updated", async () => {
    const res = await request(app).put(`/api/v1/friendships/${friendship_id}`).send({
      status: "accepted",
    }).set("Authorization", `Bearer ${test1_token}`);
    expect(res.statusCode).toBe(200);
  });

  // try modifying the friendship request after it has been accepted
  it("should return 409 Friendship request has already been accept / rejected", async () => {
    const res = await request(app).put(`/api/v1/friendships/${friendship_id}`).send({
      status: "rejected",
    }).set("Authorization", `Bearer ${test1_token}`);
    expect(res.statusCode).toBe(409);
  });

  // try deleting the friendship as an external user 
  // it("should return 403 Forbidden", async () => {
  //   const res = await request(app).delete(`/api/v1/friendships/${friendship_id}`);
  //   expect(res.statusCode).toBe(403);
  // });

  // delete the friendship 
  it("should return 200 Friendship deleted", async () => {
    const res = await request(app).delete(`/api/v1/friendships/${friendship_id}`).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  // accept a nonexistent friendship request
  it("should return 404 Friendship not found", async () => {
    const res = await request(app).put(`/api/v1/friendships/${friendship_id}`).send({
      status: "accepted",
    }).set("Authorization", `Bearer ${test1_token}`);
    expect(res.statusCode).toBe(404);
  });

  // create another friendship with test1 
  it("should return 200 Friendship created successfully", async () => {
    const res = await request(app).post("/api/v1/friendships").send({
      to: "test1",
    }).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    friendship_id2 = res.body.id;
  });

  // try deleting the friendship as the user who received it
  it("should return 400 Cannot delete pending friendship request", async () => {
    const res = await request(app).delete(`/api/v1/friendships/${friendship_id2}`).set("Authorization", `Bearer ${test1_token}`);
    expect(res.statusCode).toBe(400);
  });

  // reject the friendship request
  it("should return 200 Friendship request updated", async () => {
    const res = await request(app).put(`/api/v1/friendships/${friendship_id2}`).send({
      status: "rejected",
    }).set("Authorization", `Bearer ${test1_token}`);
    expect(res.statusCode).toBe(200);
  });

  // delete the friendship 
  it("should return 200 Friendship deleted", async () => {
    const res = await request(app).delete(`/api/v1/friendships/${friendship_id2}`).set("Authorization", `Bearer ${test1_token}`);
    expect(res.statusCode).toBe(200);
  });

  // try sending a request to a nonexistent user
  it("should return 404 User Not Found", async () => {
    const res = await request(app).post("/api/v1/friendships").send({
      to: "nonexistent",
    }).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
  it("should return 400 Invalid username", async () => {
    const res = await request(app).post("/api/v1/friendships").send({
      to: "test",
    }).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });
});


server.close();
