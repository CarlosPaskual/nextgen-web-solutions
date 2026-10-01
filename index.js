const express = require('express');

const app = express();

app.get('/api/servicios', (req, res) => {
  res.json([
    { id: 1, nombre: 'Diseño web', precio: 1200 },
    { id: 2, nombre: 'Tienda online', precio: 2500 },
    { id: 3, nombre: 'Mantenimiento mensual', precio: 150 },
  ]);
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
