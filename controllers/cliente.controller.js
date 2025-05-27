const db = require('../models/db');

exports.listar = (req, res) => {
  db.query('SELECT * FROM clientes', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.crear = (req, res) => {
  const { nombre, cedula, telefono, email } = req.body;
  db.query('INSERT INTO clientes (nombre, cedula, telefono, email) VALUES (?, ?, ?, ?)', 
    [nombre, telefono, email], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, nombre, telefono, email });
    }
  );
};

//obtener todos los clientes
exports.obtenerClientes = (req, res) => {
  db.query('SELECT * FROM clientes', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
