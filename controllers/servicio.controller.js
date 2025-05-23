const db = require('../models/db');

exports.listar = (req, res) => {
  db.query('SELECT * FROM servicios', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.crear = (req, res) => {
  const { nombre, precio } = req.body;
  db.query('INSERT INTO servicios (nombre, precio) VALUES (?, ?)', 
    [nombre, precio], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, nombre, precio });
    }
  );
};
