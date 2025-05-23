const db = require('../models/db');
const bcrypt = require('bcrypt');

exports.listarUsuarios = (req, res) => {
  db.query('SELECT id, nombre, email, rol FROM usuarios', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.obtenerUsuarioPorId = (req, res) => {
  db.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  });
};

exports.crearUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  const hash = await bcrypt.hash(password, 10);
  db.query('INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, hash, rol || 'CLIENTE'],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, nombre, email, rol });
    });
};

exports.actualizarUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  const hash = password ? await bcrypt.hash(password, 10) : null;

  const sql = password
    ? 'UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?'
    : 'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?';
  
  const values = password
    ? [nombre, email, hash, rol, req.params.id]
    : [nombre, email, rol, req.params.id];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario actualizado correctamente' });
  });
};

exports.eliminarUsuario = (req, res) => {
  db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario eliminado correctamente' });
  });
};

exports.buscarPorEmail = (req, res) => {
  db.query('SELECT id, nombre, email, rol FROM usuarios WHERE email = ?', [req.params.email], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No existe un usuario con ese email' });
    }
    res.json(rows[0]);
  });
};
