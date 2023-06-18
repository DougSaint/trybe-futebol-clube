'use strict';
import { QueryInterface, BOOLEAN, Model, INTEGER } from "sequelize";

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model>('matches', {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      homeTeamId: {
        primaryKey: true,
        type: INTEGER,
        allowNull: false,
        field: 'home_team_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      homeTeamGoals: {
        type: INTEGER,
        allowNull: false,
        field: 'home_team_goals',
      },
      awayTeamId: {
        primaryKey: true,
        type: INTEGER,
        allowNull: false,
        field: 'away_team_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      awayTeamGoals: {
        type: INTEGER,
        allowNull: false,
        field: 'away_team_goals',
      },
      inProgress: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'in_progress'
      },
    })
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('matches');
  },
}; 