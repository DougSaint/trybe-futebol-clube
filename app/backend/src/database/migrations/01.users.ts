"use strict";

import { Model, INTEGER, STRING, QueryInterface } from "sequelize";

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model>("users", {
      id: {
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: STRING,
        allowNull: false,
      },
      role: {
        type: STRING,
        allowNull: false,
      },
      email: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: STRING,
        allowNull: false,
      },
    });
  },

  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable("users");
  },
};
  