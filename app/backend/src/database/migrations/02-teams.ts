'use strict';

import { Model, INTEGER, STRING, QueryInterface } from "sequelize";

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model>('teams', {
      id: {
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      teamName: {
        type: STRING,
        allowNull: false,
        field: 'team_name'
      }
    })
  },

  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('teams');
  },
};