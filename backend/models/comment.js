import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define('Comment', {
    postId: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    username: DataTypes.STRING,
  }, {
    timestamps: true
  }); 