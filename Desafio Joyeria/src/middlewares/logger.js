const fs = require('fs');
const path = require('path');

const logger = (req, res, next) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    fs.appendFile(path.join(__dirname, '../../logs.txt'), log, (err) => {
        if (err) {
            console.error('Error al registrar la solicitud:', err);
        }
    });
    next();
};

module.exports = logger;