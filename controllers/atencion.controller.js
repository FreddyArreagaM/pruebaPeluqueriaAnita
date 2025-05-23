const db = require('../models/db');

exports.listar = (req, res) => {
  db.query('SELECT * FROM atenciones ORDER BY fecha DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.crear = (req, res) => {
  const { citaId, fecha, total } = req.body;
  db.query(
    'INSERT INTO atenciones (cita_id, fecha, total) VALUES (?, ?, ?)',
    [citaId, fecha, total],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
};
