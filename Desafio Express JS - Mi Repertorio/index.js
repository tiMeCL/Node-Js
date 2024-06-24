const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para consumir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Agregar una canción
app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo');
        }
        let canciones = JSON.parse(data);
        nuevaCancion.id = canciones.length ? canciones[canciones.length - 1].id + 1 : 1;
        canciones.push(nuevaCancion);
        fs.writeFile('repertorio.json', JSON.stringify(canciones), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error escribiendo el archivo');
            }
            res.status(201).send('Canción agregada');
        });
    });
});

// Mostrar todas las canciones.
app.get('/canciones', (req, res) => {
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo');
        }
        res.json(JSON.parse(data));
    });
});

// Actualizar o editar una canción.
app.put('/canciones/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const cancionActualizada = req.body;
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo');
        }
        let canciones = JSON.parse(data);
        const index = canciones.findIndex(c => c.id === id);
        if (index === -1) {
            return res.status(404).send('Canción no encontrada');
        }
        canciones[index] = { ...canciones[index], ...cancionActualizada };
        fs.writeFile('repertorio.json', JSON.stringify(canciones), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error escribiendo el archivo');
            }
            res.send('Canción actualizada');
        });
    });
});

// Eliminar una canción.
app.delete('/canciones/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo');
        }
        let canciones = JSON.parse(data);
        const nuevaLista = canciones.filter(c => c.id !== id);
        fs.writeFile('repertorio.json', JSON.stringify(nuevaLista), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error escribiendo el archivo');
            }
            res.send('Canción eliminada');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor levantado ejecutandose en el puerto : ${PORT}`);
});
