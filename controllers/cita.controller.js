const db = require('../models/db');

exports.listar = (req, res) => {
  db.query('SELECT * FROM citas', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.crear = (req, res) => {
  const { cliente_id, fecha, estado, observaciones } = req.body;
  db.query('INSERT INTO citas (cliente_id, fecha, estado, observaciones) VALUES (?, ?, ?, ?)', 
    [cliente_id, fecha, estado, observaciones], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
};

exports.obtenerCitas = (req, res) => {
  db.query('SELECT * FROM citas', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};