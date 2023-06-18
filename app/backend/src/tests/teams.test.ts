import * as sinon from "sinon";
import * as chai from "chai";
// @ts-ignore
import chaiHttp = require("chai-http");

import { app } from "../app";
import SequelizeTeam from "../database/models/SequelizeTeam";

import { Response } from "superagent";

chai.use(chaiHttp);

const { expect } = chai;

describe("Seu teste", () => {
  let chaiHttpResponse: Response;

  let teamsMock: sinon.SinonMock;

  before(async () => {
    const mockTeam = SequelizeTeam.build({ id: 1, teamName: "team1" });
    teamsMock = sinon.mock(SequelizeTeam);
    teamsMock.expects("findAll").resolves([mockTeam]);

    teamsMock.expects("findByPk").withArgs(1).resolves(mockTeam);
  });

  after(() => {
    teamsMock.restore();
  });

  it("should return a list of teams", async () => {
    chaiHttpResponse = await chai.request(app).get("/teams");
    console.log(chaiHttpResponse.body);
    expect(chaiHttpResponse.status).to.eq(200);
    expect(chaiHttpResponse.body).to.be.an("array");
    expect(chaiHttpResponse.body[0]).to.have.property("id");
    expect(chaiHttpResponse.body[0]).to.have.property("teamName");
  });

  it("should return a team by id", async () => {
    const res = await chai.request(app).get(`/teams/${1}`);

    expect(res.status).to.eq(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("id");
    expect(res.body).to.have.property("teamName");
    expect(res.body.id).to.eq(1);
    expect(res.body.teamName).to.eq("team1");
  });
});
