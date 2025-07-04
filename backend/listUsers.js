import { sequelize, User } from './models/index.js';

async function listUsers() {
  await sequelize.sync();
  const users = await User.findAll();
  users.forEach(u => {
    console.log(`用户名: ${u.username}, isAdmin: ${u.isAdmin}`);
  });
  process.exit(0);
}

listUsers(); 