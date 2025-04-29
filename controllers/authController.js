const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const logger = require('../logger');   // 🚨 Importación del logger

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validar si ya existe el email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      logger.warn(`⚠️ Intento de registro con email ya registrado: ${email}`);
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    logger.info(`✅ Usuario registrado correctamente: ${email}`);
    res.status(201).json({ message: 'Usuario registrado correctamente.' });
  } catch (error) {
    logger.error(`❌ Error al registrar usuario (${email}): ${error.message}`);
    res.status(500).json({ message: 'Error al registrar.', error });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.warn(`⚠️ Intento de login con usuario no encontrado: ${email}`);
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`⚠️ Contraseña incorrecta en login para: ${email}`);
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },  // 🚨 Aquí incluimos el rol
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    logger.info(`✅ Login exitoso para usuario: ${email}`);
    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    logger.error(`❌ Error al iniciar sesión (${email}): ${error.message}`);
    res.status(500).json({ message: 'Error al iniciar sesión.', error });
  }
};
