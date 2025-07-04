import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define('Destination', {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.TEXT }
  }); 