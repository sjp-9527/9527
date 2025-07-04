import { DataTypes } from 'sequelize';
 
export default (sequelize) =>
  sequelize.define('Like', {
    postId: DataTypes.INTEGER,
    username: DataTypes.STRING,
  }); 