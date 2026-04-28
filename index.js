const express = require('express');
const connection = require('./db');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// --- RUTAS GET (LEER) ---
app.get('/alumnos', (req, res) => {
    connection.query('SELECT * FROM Alumnos', (err, results) => res.json(results));
});

app.get('/instructores', (req, res) => {
    connection.query('SELECT * FROM Instructores', (err, results) => res.json(results));
});

app.get('/talleres', (req, res) => {
    const q = `SELECT t.*, i.nombre AS nombre_instructor FROM Talleres t 
               LEFT JOIN Instructores i ON t.id_instructor = i.id_instructor`;
    connection.query(q, (err, results) => res.json(results));
});

app.get('/inscripciones', (req, res) => {
    const q = `SELECT ins.*, a.nombre AS nombre_alumno, a.apellido AS apellido_alumno, t.nombre_taller 
               FROM Inscripciones ins
               JOIN Alumnos a ON ins.id_alumno = a.id_alumno
               JOIN Talleres t ON ins.id_taller = t.id_taller`;
    connection.query(q, (err, results) => res.json(results));
});

app.get('/asistencias', (req, res) => {
    const q = `SELECT asis.*, a.nombre AS nombre_alumno, a.apellido AS apellido_alumno, t.nombre_taller 
               FROM Asistencias asis
               JOIN Inscripciones ins ON asis.id_inscripcion = ins.id_inscripcion
               JOIN Alumnos a ON ins.id_alumno = a.id_alumno
               JOIN Talleres t ON ins.id_taller = t.id_taller`;
    connection.query(q, (err, results) => res.json(results));
});

// --- RUTAS POST (CREAR) ---
app.post('/alumnos', (req, res) => {
    const { nombre, apellido, dni, correo } = req.body;
    connection.query('INSERT INTO Alumnos (nombre, apellido, dni, correo) VALUES (?, ?, ?, ?)', [nombre, apellido, dni, correo], (err, result) => {
        if (err) {
            console.error('Error al insertar alumno:', err);
            return res.status(500).json({ ok: false, error: err.message });
        }
        res.json({ ok: true, id: result.insertId });
    });
});

app.post('/instructores', (req, res) => {
    const { nombre, especialidad } = req.body;
    connection.query('INSERT INTO Instructores (nombre, especialidad) VALUES (?, ?)', [nombre, especialidad], (err, result) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });
        res.json({ ok: true, id: result.insertId });
    });
});

app.post('/talleres', (req, res) => {
    const { nombre_taller, descripcion, cupos, id_instructor } = req.body;
    connection.query('INSERT INTO Talleres (nombre_taller, descripcion, cupos, id_instructor) VALUES (?, ?, ?, ?)', [nombre_taller, descripcion, cupos, id_instructor], (err, result) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });
        res.json({ ok: true, id: result.insertId });
    });
});

app.post('/inscripciones', (req, res) => {
    const { id_alumno, id_taller, fecha_inscripcion } = req.body;
    connection.query('INSERT INTO Inscripciones (id_alumno, id_taller, fecha_inscripcion) VALUES (?, ?, ?)', [id_alumno, id_taller, fecha_inscripcion], (err, result) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });
        res.json({ ok: true, id: result.insertId });
    });
});

app.post('/asistencias', (req, res) => {
    const { id_inscripcion, fecha, estado } = req.body;
    connection.query('INSERT INTO Asistencias (id_inscripcion, fecha, estado) VALUES (?, ?, ?)', [id_inscripcion, fecha, estado], (err, result) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });
        res.json({ ok: true, id: result.insertId });
    });
});

// --- RUTA PUT (EDITAR) ---
app.put('/:tabla/:columna/:pk_col/:id', (req, res) => {
    const { tabla, columna, pk_col, id } = req.params;
    const q = `UPDATE ${tabla} SET ${columna} = ? WHERE ${pk_col} = ?`;
    connection.query(q, [req.body.nuevoValor, id], () => res.json({ok:true}));
});

// --- RUTA DELETE (ELIMINAR) ---
app.delete('/:tabla/:pk_col/:id', (req, res) => {
    const { tabla, pk_col, id } = req.params;
    connection.query(`DELETE FROM ${tabla} WHERE ${pk_col} = ?`, [id], () => res.json({ok:true}));
});

app.listen(3000, () => console.log('🚀 Servidor en http://localhost:3000'));
