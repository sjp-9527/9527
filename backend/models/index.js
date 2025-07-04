import { Sequelize } from 'sequelize';
import UserModel from './user.js';
import DestinationModel from './destination.js';
import PostModel from './post.js';
import CommentModel from './comment.js';
import LikeModel from './like.js';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

export const User = UserModel(sequelize);
export const Destination = DestinationModel(sequelize);
export const Post = PostModel(sequelize);
export const Comment = CommentModel(sequelize);
export const Like = LikeModel(sequelize);

sequelize.sync(); 