import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import {InvalidMatch, createMatch, matchesInProgress, matchesMock, newMatch } from "./mocks/matches"
import { app } from '../app';
import SequelizeMatches from '../database/models/SequelizeMatches';
import SequelizeTeams from '../database/models/SequelizeTeam';

chai.use(chaiHttp);

const { expect } = chai;

describe('Matches Endpoint Tests', () => {
  let matchesMock: sinon.SinonMock;
  let teamsMock: sinon.SinonMock;

  beforeEach(() => {
    matchesMock = sinon.mock(SequelizeMatches);
    teamsMock = sinon.mock(SequelizeTeams);
  });

  afterEach(() => {
    matchesMock.restore();
    teamsMock.restore();
  });

  it('should return all matches', async () => {
    matchesMock.expects('findAll').resolves(matchesMock as unknown as SequelizeMatches[]);

    const response = await chai.request(app).get('/matches');

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    // Assert other expectations on the response body or status
  });

  it('should return matches in progress', async () => {
    matchesMock.expects('findAll').resolves(matchesInProgress as unknown as SequelizeMatches[]);

    const response = await chai.request(app).get('/matches?inProgress=true');

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    // Assert other expectations on the response body or status
  });

  it('should finish a match', async () => {
    const matchId = 42;

    matchesMock.expects('findOne').withArgs({ where: { id: matchId } }).resolves(matchesMock[1] as unknown as SequelizeMatches);

    matchesMock.expects('update').withArgs({ inProgress: false }, { where: { id: matchId } }).resolves([1]);

    const response = await chai.request(app).patch(`/matches/${matchId}/finish`);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ message: 'Finished' });
    // Assert other expectations on the response body or status
  });

  it('should update a match', async () => {
    const matchId = 42;
    const updatedGoals = { homeTeamGoals: 3, awayTeamGoals: 1 };

    matchesMock.expects('findByPk').withArgs(matchId).resolves(matchesMock[0] as unknown as SequelizeMatches);

    matchesMock.expects('save').withArgs({ homeTeamGoals: 3, awayTeamGoals: 1 }).resolves(matchesMock[0] as unknown as SequelizeMatches);

    const response = await chai.request(app).patch(`/matches/${matchId}`).send(updatedGoals);

    expect(response.status).to.equal(200);
    // Assert other expectations on the response body or status
  });

  it('should create a match', async () => {
    const match = createMatch;

    teamsMock.expects('findByPk').withArgs(match.homeTeamId).resolves(teamsMock as unknown as SequelizeTeams);

    teamsMock.expects('findByPk').withArgs(match.awayTeamId).resolves(teamsMock as unknown as SequelizeTeams);

    matchesMock.expects('create').withArgs({ ...match, inProgress: true }).resolves(matchesMock[0] as unknown as SequelizeMatches);

    const response = await chai.request(app).post('/matches').send(match);

    expect(response.status).to.equal(201);
    // Assert other expectations on the response body or status
  });
});
