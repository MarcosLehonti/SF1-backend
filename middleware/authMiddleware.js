const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Obtener token del encabezado Authorization: Bearer TOKEN
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ahora guardamos el usuario completo necesario para CASL
    req.user = {
      id: decoded.id,
      role: decoded.role   // Aquí va el rol desde el token
    };

    next(); // Continúa con la siguiente función
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
