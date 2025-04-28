const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.get('/',
    authMiddleware,
    authorize('read', 'Logs'),
    (req, res) => {
        const logPath = path.join(__dirname, '..', 'logs', 'combined.log');

        fs.readFile(logPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'No se pudo leer el archivo de logs.' });
            }
            res.json({ logs: data });
        });
    }
);

module.exports = router;
