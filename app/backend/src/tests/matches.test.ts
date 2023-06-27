import * as sinon from "sinon";
import * as chai from "chai";
// @ts-ignore
import chaiHttp = require("chai-http");
import { app } from "../app";
chai.use(chaiHttp);
const { expect } = chai;

describe("Matches Endpoint Tests", () => {
  describe("Endpoint getMatches", () => {
    it("should return all matches", async () => {
      const response = await chai.request(app).get("/matches");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
    });
  });

  describe("PATCH /matches/:id/finish", () => {
    let authToken = "";

    beforeEach(async () => {
      

      const loginResponse = await chai.request(app).post("/login").send({
        email: "admin@admin.com",
        password: "secret_admin",
      });

      authToken = loginResponse.body.token;
    });



    it("should finish a match", async () => {
      const matchId = 42;

      const response = await chai
        .request(app)
        .patch(`/matches/${matchId}/finish`)
        .set("Authorization", authToken);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ message: "Finished" });
    });

    it("should fail to finish a non-existing match", async () => {
      const matchId = 999;
      const response = await chai
        .request(app)
        .patch(`/matches/${matchId}/finish`)
        .set("Authorization", authToken);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ message: "not exists" });
    });
  });

  describe("PATCH /matches/:id", () => {
    type updateGoals = {
      homeTeamGoals: number;
      awayTeamGoals: number;
    };

    let matchId: number;
    let updatedGoals: updateGoals;
    let authToken = "";

    beforeEach(async () => {
      matchId = 42;
      updatedGoals = { homeTeamGoals: 3, awayTeamGoals: 1 };
     
      const loginResponse = await chai.request(app).post("/login").send({
        email: "admin@admin.com",
        password: "secret_admin",
      });

      authToken = loginResponse.body.token;
    });

    it("should update a match", async () => {
      const response = await chai
        .request(app)
        .patch(`/matches/${matchId}`)
        .send(updatedGoals)
        .set("Authorization", authToken);

      expect(response.status).to.equal(200);
    });

    it("should fail to update a non-existing match", async () => {
      const nonExistingMatchId = 999;

      const response = await chai
        .request(app)
        .patch(`/matches/${nonExistingMatchId}`)
        .send(updatedGoals)
        .set("Authorization", authToken);

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ message: "not exists" });
    });
  });

  
 
});
