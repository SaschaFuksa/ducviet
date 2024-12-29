const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('ducviet.db');

db.run(`
  CREATE TABLE IF NOT EXISTS translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    german TEXT NOT NULL,
    vietnamese TEXT NOT NULL
  )
`);

app.post('/api/translations', (req, res) => {
  const { german, vietnamese } = req.body;
  db.get(
    'SELECT id FROM translations WHERE german = ? AND vietnamese = ?',
    [german, vietnamese],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'DB Error' });
      if (row) return res.status(400).json({ error: 'Duplicate' });

      db.run(
        'INSERT INTO translations (german, vietnamese) VALUES (?, ?)',
        [german, vietnamese],
        function (err2) {
          if (err2) return res.status(500).json({ error: 'DB Error' });
          res.json({ id: this.lastID, german, vietnamese });
        }
      );
    }
  );
});

app.get('/api/translations', (req, res) => {
  db.all('SELECT * FROM translations', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(rows);
  });
});

app.put('/api/translations/:id', (req, res) => {
  const { german, vietnamese } = req.body;
  db.run(
    'UPDATE translations SET german = ?, vietnamese = ? WHERE id = ?',
    [german, vietnamese, req.params.id],
    err => {
      if (err) return res.status(500).json({ error: 'DB Error' });
      res.json({ success: true });
    }
  );
});

app.delete('/api/translations/:id', (req, res) => {
  db.run('DELETE FROM translations WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json({ success: true });
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
