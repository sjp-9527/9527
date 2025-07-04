import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define('Post', {
    text: DataTypes.TEXT,
    image: DataTypes.STRING,
    username: DataTypes.STRING,
  }, {
    timestamps: true
  }); 