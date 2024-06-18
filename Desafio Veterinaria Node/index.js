const { registrar, leer } = require('./operaciones');
const args = process.argv.slice(2);

const comando = args[0];

if (comando === 'registrar') {
    const [nombre, edad, tipo, color, enfermedad] = args.slice(1);
    registrar(nombre, edad, tipo, color, enfermedad);
} else if (comando === 'leer') {
    leer();
} else {
    console.log('Comando no reconocido. Usa "registrar" o "leer".');
}