// backend/server.js
const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ─────────────  Middleware  ───────────── */
app.use(cors());
app.use(express.json());

/* ──────────  MySQL connection  ────────── */
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',        // put your MySQL root password if any
  database : 'sensor'   // exact DB name
});

db.connect(err => {
  if (err) {
    console.error('❌  Database connection failed:', err.stack);
    return;
  }
  console.log('✅  Connected to MySQL database.');
});

/* ───────────────  /report  ───────────────
   Example: /report?machine=All&from=2024-07-01&to=2024-07-02          */
app.get('/report', (req, res) => {
  const { machine, from, to } = req.query;
  console.log('📥  Request:', { machine, from, to });

  // basic validation
  if (!machine || !from || !to) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  // base query and params
  let   query  = 'SELECT * FROM resulttable WHERE `Date` BETWEEN ? AND ?';
  const params = [from, to];

  // add machine filter if needed
  if (machine !== 'All') {
    query +=
      " AND JSON_UNQUOTE(JSON_EXTRACT(JsonData, '$.MACHINE_NAME')) = ?";
    params.push(machine);
  }

  console.log('📤  SQL  :', query);
  console.log('📦  Params:', params);

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌  Query error:', err);
      return res
        .status(500)
        .json({ error: 'Query failed', details: err.message });
    }

    console.log(`✅  Rows found: ${results.length}`);
    res.json(results);
  });
});

/* ────────────  Start server  ──────────── */
app.listen(PORT, () => {
  console.log(`🚀  Server running at http://localhost:${PORT}`);
});
