require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Conexión a MySQL
const db = mysql.createConnection({
  host: 'mainline.proxy.rlwy.net',
  port: 23458,
  user: 'root',
  password: 'myfsudzUttcJFdyrIrZGFODkQgBewpwS',
  database: 'railway',
  
});

db.connect(err => {
  if (err) throw err;
  console.log('🟢 Conectado a MySQL');
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../')));

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// 🔎 Obtener productos por categoría
app.get('/productos', (req, res) => {
  const categoria = req.query.categoria;
  const sql = categoria
    ? 'SELECT * FROM productos WHERE categoria = ?'
    : 'SELECT * FROM productos';

  db.query(sql, categoria ? [categoria] : [], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// 🧾 Agregar nuevo producto
app.post('/productos', (req, res) => {
  const { nombre, precio, categoria, cantidad, unidad, imagen } = req.body;
  const sql = 'INSERT INTO productos (nombre, precio, categoria, cantidad, unidad, imagen) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nombre, precio, categoria, cantidad, unidad, imagen], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: result.insertId });
  });
});

// 🗑️ Eliminar producto
app.delete('/productos/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// 🔐 Login
app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  const sql = 'SELECT * FROM admin WHERE usuario = ? AND contrasena = ?';
  db.query(sql, [usuario, contrasena], (err, result) => {
    if (err) {
      console.error('Error en login:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: result.length > 0 });
  });
});

// 💬 Comentarios
app.post('/comentarios', (req, res) => {
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ error: 'Comentario vacío' });
  db.query('INSERT INTO comentarios (texto) VALUES (?)', [texto], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: result.insertId });
  });
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
