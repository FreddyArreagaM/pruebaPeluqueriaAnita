const db = require('../models/db');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

    const usuario = rows[0];
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

    res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
  });
};

exports.register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  const hash = await bcrypt.hash(password, 10);
  db.query('INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)', 
    [nombre, email, hash, rol || 'CLIENTE'], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, nombre, email, rol });
    }
  );
};