const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'bd-asistencia',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error: No se pudo conectar. Verifica si Laragon está encendido.');
    console.error('Detalle del error:', err.message);
    return;
  }
  console.log('✅ ¡Conexión exitosa a la base de datos bd-asistencia!');
});

module.exports = connection;
