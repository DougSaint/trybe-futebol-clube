import LeaderBoardService from "../services/Leaderboard.service";
import SequelizeTeam from "../database/models/SequelizeTeam";
import SequelizeMatches from "../database/models/SequelizeMatches";
import { Response } from "superagent";

import { app } from "../app";
import { expect } from "chai";

import * as sinon from "sinon";
import * as chai from "chai";
// @ts-ignore
import chaiHttp = require("chai-http");
import ITeamStats from "../Interfaces/ITeamStats";

describe("LeaderBoardService Tests", () => {
  let teamsMock: sinon.SinonMock;
  let matchesMock: sinon.SinonMock;

  beforeEach(() => {
    teamsMock = sinon.mock(SequelizeTeam);
    matchesMock = sinon.mock(SequelizeMatches);
  });

  afterEach(() => {
    // restore mocks after each test
    teamsMock.restore();
    matchesMock.restore();
  });

  it("should return leaderboard data", async () => {
    const response = await chai.request(app).get("/leaderboard/home");
    expect(response.status).to.eq(200);
    expect(response.body).to.be.an("array");
  });

  it("should return leaderboard home data", async () => {
    const response = await chai.request(app).get("/leaderboard/home");

    expect(response.status).to.eq(200);
    expect(response.body).to.be.an("array");

    // verifique cada item do array retornado
    response.body.forEach((item: any) => {
      expect(item).to.have.property("name").that.is.a("string");
      expect(item).to.have.property("totalPoints").that.is.a("number");
      expect(item).to.have.property("totalVictories").that.is.a("number");
      expect(item).to.have.property("totalLosses").that.is.a("number");
      expect(item).to.have.property("totalDraws").that.is.a("number");
      expect(item).to.have.property("totalGames").that.is.a("number");
      expect(item).to.have.property("goalsOwn").that.is.a("number");
      expect(item).to.have.property("goalsFavor").that.is.a("number");
      expect(item).to.have.property("goalsBalance").that.is.a("number");
      expect(item).to.have.property("efficiency").that.is.a("string");
    });
  });

  it("should return leaderboard away data", async () => {
    const response = await chai.request(app).get("/leaderboard/away");

    expect(response.status).to.eq(200);
    expect(response.body).to.be.an("array");

    // verifique cada item do array retornado
    response.body.forEach((item: ITeamStats) => {
      expect(item).to.have.property("name").that.is.a("string");
      expect(item).to.have.property("totalPoints").that.is.a("number");
      expect(item).to.have.property("totalVictories").that.is.a("number");
      expect(item).to.have.property("totalLosses").that.is.a("number");
      expect(item).to.have.property("totalDraws").that.is.a("number");
      expect(item).to.have.property("totalGames").that.is.a("number");
      expect(item).to.have.property("goalsOwn").that.is.a("number");
      expect(item).to.have.property("goalsFavor").that.is.a("number");
      expect(item).to.have.property("goalsBalance").that.is.a("number");
      expect(item).to.have.property("efficiency").that.is.a("string");
    });
  });

  it("should return leaderboard away data", async () => {
    const response = await chai.request(app).get("/leaderboard");

    expect(response.status).to.eq(200);
  });
});
