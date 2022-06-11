import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Users = sequelize.define(
  "apmin-users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.JSON,
    },
  },
  {
    timestamps: false,
  }
);