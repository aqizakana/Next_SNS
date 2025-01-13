import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
  // SQLite ファイルに接続
  const db = await open({
    filename: './db.sqlite3',
    driver: sqlite3.Database,
  });

  const rows = await db.all('SELECT * FROM posts');
  res.status(200).json(rows);
}
