import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.get("PRAGMA table_info(Users)", (err, row) => {
    db.all("PRAGMA table_info(Users)", (err, columns) => {
      const hasIsAdmin = columns.some(col => col.name === 'isAdmin');
      if (hasIsAdmin) {
        console.log('isAdmin 字段已存在，无需迁移');
        db.close();
        return;
      }
      db.run("ALTER TABLE Users ADD COLUMN isAdmin BOOLEAN DEFAULT 0", err => {
        if (err) {
          console.error('添加 isAdmin 字段失败:', err);
        } else {
          console.log('isAdmin 字段添加成功');
        }
        db.close();
      });
    });
  });
}); 