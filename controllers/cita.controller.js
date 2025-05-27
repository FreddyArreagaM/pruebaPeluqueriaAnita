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

exports.actualizarEstado = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  // Validar que estado tenga un valor válido
  const estadosValidos = ['PENDIENTE', 'REALIZADA', 'CANCELADA'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  db.query(
    'UPDATE citas SET estado = ? WHERE id = ?',
    [estado, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Cita no encontrada' });
      }
      res.json({ message: 'Estado actualizado correctamente' });
    }
  );
};

// En cita.controller.js
exports.obtenerCitasPorCedula = (req, res) => {
  const cedula = req.params.cedula;
  const sql = `
    SELECT c.* FROM citas c
    JOIN clientes cl ON c.cliente_id = cl.id
    WHERE cl.cedula = ?
  `;
  db.query(sql, [cedula], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

