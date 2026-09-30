const request = require('supertest');
const app = require('./app');
const pool = require('./db');

describe('Pruebas de Integración - API Lomax S.A.', () => {

  afterAll(async () => {
    await pool.end(); // Cierra las conexiones activas a la BD
  });
  
  test('GET /categorias debe retornar las categorías de PostgreSQL', async () => {
    const response = await request(app).get('/categorias');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /productos debe retornar la lista de productos', async () => {
    const response = await request(app).get('/productos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /productos con archivo inválido debe retornar error 400', async () => {
    const response = await request(app)
      .post('/productos')
      .send({
        codigo: 'TEST-ERR-01',
        nombre: 'Producto Invalido',
        precio: 10,
        categoria_id: 1,
        fileType: 'text/plain'
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

});