import * as sinon from "sinon";
import * as chai from "chai";
// @ts-ignore
import chaiHttp = require("chai-http");

import { app } from "../app";

import { Response } from "superagent";
import AuthService from "../services/Auth.service";
import authController, { AuthController } from "../controllers/Auth.controller";

chai.use(chaiHttp);

const { expect } = chai;

describe("Authentication Route", () => {
  let authServiceMock: sinon.SinonMock;

  before(() => {
    authServiceMock = sinon.mock(AuthService);
  });

  after(() => {
    authServiceMock.restore();
  });

  it("should respond with a token for a valid login", async () => {
    authServiceMock.expects("login").resolves(true);

    const res = await chai
      .request(app)
      .post("/login")
      .send({ email: "valid@email.com", password: "validPassword" });

    expect(res.status).to.eq(200);
    expect(res.body).to.have.property("token");
  });

  it("should respond with 401 for an invalid login", async () => {
    authServiceMock.expects("login").resolves(false);

    const res = await chai
      .request(app)
      .post("/login")
      .send({ email: "invalid@email.com", password: "invalidPassword" });

    expect(res.status).to.eq(401);
    expect(res.body.message).to.eq("Invalid email or password");
  });

  it("should respond with 400 when a field is missing", async () => {
    const res = await chai
      .request(app)
      .post("/login")
      .send({ email: "noPassword@email.com" });

    expect(res.status).to.eq(400);
    expect(res.body.message).to.eq("All fields must be filled");
  });
  it("should respond with 401 for an invalid email", async () => {
    const res = await chai
      .request(app)
      .post("/login")
      .send({ email: "invalid", password: "validPassword" });

    expect(res.status).to.eq(401);
    expect(res.body.message).to.eq("Invalid email or password");
  });

  it("should respond with 401 for a password that is too short", async () => {
    const res = await chai
      .request(app)
      .post("/login")
      .send({ email: "valid@email.com", password: "short" });

    expect(res.status).to.eq(401);
    expect(res.body.message).to.eq("Invalid email or password");
  });

  describe("/login/role", () => {
    // Before each test, reset the AuthService mock
    beforeEach(() => {
      authServiceMock.restore();
    });

    it("should respond with 401 when no token is provided", async () => {
      const res = await chai.request(app).get("/login/role");

      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq("Token not found");
    });

    it("should respond with 401 when an invalid token is provided", async () => {
      const res = await chai
        .request(app)
        .get("/login/role")
        .set("authorization", "invalid-token");

      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq("Token must be a valid token");
    });

    it("should respond with 401 when a valid token is provided but no user is found", async () => {
      authServiceMock.expects("findByEmail").resolves(null);

      const res = await chai
        .request(app)
        .get("/login/role")
        .set("authorization", "valid-token-no-user");

      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq("Token must be a valid token");
    });

  });
});
