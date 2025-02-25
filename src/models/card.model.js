import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Card extends Model {}

Card.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  color: {
    type: DataTypes.STRING(7) // VARCHAR(7)
  }
}, {
  sequelize,
  tableName: "card"
});
