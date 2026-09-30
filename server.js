const express = require('express');
const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// GET: Obtener Categorías
app.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY categoria_id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET: Obtener Productos
app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY producto_id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST: Crear Producto
app.post('/productos', async (req, res) => {
  try {
    const { codigo, nombre, descripcion, precio, categoria_id } = req.body;
    const query = `
      INSERT INTO productos (codigo, nombre, descripcion, precio, categoria_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [codigo, nombre, descripcion, precio, categoria_id];
    const newProduct = await pool.query(query, values);
    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor web corriendo en http://localhost:${PORT}`);
});