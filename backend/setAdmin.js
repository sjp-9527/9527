import { sequelize, User } from './models/index.js';

async function setAdmin(username) {
  await sequelize.sync();
  const user = await User.findOne({ where: { username } });
  if (!user) {
    console.log('用户不存在');
    process.exit(1);
  }
  user.isAdmin = true;
  await user.save();
  console.log(`${username} 已设置为管理员`);
  process.exit(0);
}

setAdmin(process.argv[2]); 