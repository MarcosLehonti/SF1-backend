const bcrypt = require('bcryptjs');
const User = require('../models/User');
const logger = require('../logger');   // 🚨 Importación del logger

// Obtener datos del usuario logueado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {   // Cambié a req.user.id según tu authMiddleware actualizado
      attributes: ['id', 'name', 'email', 'role']
    });

    if (!user) {
      logger.warn(`⚠️ Perfil no encontrado para el usuario ID: ${req.user.id}`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    logger.info(`✅ Perfil obtenido para el usuario ID: ${req.user.id}`);
    res.json(user);
  } catch (err) {
    logger.error(`❌ Error al obtener perfil: ${err.message}`);
    res.status(500).json({ message: 'Error al obtener perfil', error: err });
  }
};

// ✏️ Editar nombre y correo
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    await User.update({ name, email }, { where: { id: req.user.id } });
    logger.info(`✏️ Perfil actualizado para el usuario ID: ${req.user.id}`);
    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (err) {
    logger.error(`❌ Error al actualizar perfil: ${err.message}`);
    res.status(500).json({ message: 'Error al actualizar perfil', error: err });
  }
};

// 🔒 Cambiar contraseña
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      logger.warn(`⚠️ Intento de cambio de contraseña fallido (contraseña incorrecta) para usuario ID: ${req.user.id}`);
      return res.status(400).json({ message: 'Contraseña actual incorrecta' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });

    logger.info(`🔒 Contraseña cambiada correctamente para usuario ID: ${req.user.id}`);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    logger.error(`❌ Error al cambiar contraseña: ${err.message}`);
    res.status(500).json({ message: 'Error al cambiar contraseña', error: err });
  }
};

// 📋 Listar todos los usuarios
exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });

    logger.info(`📋 Usuarios listados por usuario ID: ${req.user.id}`);
    res.json(users);
  } catch (err) {
    logger.error(`❌ Error al listar usuarios: ${err.message}`);
    res.status(500).json({ message: 'Error al listar usuarios', error: err });
  }
};

// 🔧 Cambiar el rol de un usuario (Solo Admin)
exports.changeUserRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  const validRoles = ['admin', 'colaborador', 'diseñador'];

  if (!validRoles.includes(role)) {
    logger.warn(`⚠️ Intento de asignar rol inválido: "${role}" por usuario ID: ${req.user.id}`);
    return res.status(400).json({ message: '⚠️ Rol no válido' });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      logger.warn(`⚠️ Intento de cambio de rol a usuario inexistente ID: ${userId}`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.update({ role });

    logger.info(`🔧 Rol del usuario ID: ${userId} actualizado a "${role}" por admin ID: ${req.user.id}`);
    res.json({ message: `✅ Rol actualizado a "${role}" correctamente` });
  } catch (err) {
    logger.error(`❌ Error al actualizar rol: ${err.message}`);
    res.status(500).json({ message: 'Error al actualizar rol', error: err });
  }
};
