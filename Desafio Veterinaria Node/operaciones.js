const fs = require('fs');
const path = './citas.json';

// Función para registrar una nueva cita
function registrar(nombre, edad, tipo, color, enfermedad) {
    const nuevaCita = {
        nombre,
        edad,
        tipo,
        color,
        enfermedad
    };

    // Leer el archivo JSON existente
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo', err);
            return;
        }

        const citas = JSON.parse(data);
        citas.push(nuevaCita);

        // Escribir el nuevo arreglo de citas en el archivo
        fs.writeFile(path, JSON.stringify(citas, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir el archivo', err);
            } else {
                console.log('Cita registrada exitosamente.');
            }
        });
    });
}

// Función para leer todas las citas registradas
function leer() {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo', err);
            return;
        }

        const citas = JSON.parse(data);
        console.log('Citas registradas:', citas);
    });
}

module.exports = { registrar, leer };
