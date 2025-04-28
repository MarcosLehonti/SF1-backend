const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');   // Importación añadida

// Rutas protegidas por JWT
router.get('/me', authMiddleware, userController.getProfile);
router.put('/me', authMiddleware, userController.updateProfile);
router.put('/me/password', authMiddleware, userController.changePassword);

// 🔒 Ruta protegida por rol (solo admin)
router.get('/lista-users',
  authMiddleware,
  authorize('read', 'User'),
  userController.listUsers
);

router.put('/:id/role',
    authMiddleware,
    authorize('update', 'User'),   // Solo admin podrá cambiar roles
    userController.changeUserRole
  );
  

module.exports = router;
