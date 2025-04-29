const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear proyecto
router.post('/', authMiddleware, projectController.createProject);

// Obtener proyectos del usuario autenticado
router.get('/', authMiddleware, projectController.getMyProjects);

module.exports = router;
