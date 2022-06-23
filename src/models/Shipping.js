import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Shippings = sequelize.define(
  "apmin-shippings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.JSON,
    },
  },
  {
    timestamps: true,
  }
);