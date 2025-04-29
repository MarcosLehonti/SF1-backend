const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');  // Aunque no lo estás usando, lo dejamos si es necesario después
const fs = require('fs');
const path = require('path');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User'); // importa modelo para sincronización
const authMiddleware = require('./middleware/authMiddleware');
const authorize = require('./middleware/authorize');
const logRoutes = require('./routes/LogRoutes');
const projectRoutes = require('./routes/projectRoutes');




require('dotenv').config();

const app = express();

// 🔵 PRIMERO: configurar CORS bien
app.use(cors({
    origin: 'https://sf-1-fronted.vercel.app',
    credentials: true
  }));
  
  // Luego parsear JSON


app.use(express.json());
app.use(cors());

// Tus rutas existentes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/projects', projectRoutes);



  

// Conexión con la base de datos
sequelize.sync().then(() => {
    console.log('Conexion exitosa a la base de datos');
}).catch(err => {
    console.error('Error al conectar con la base de datos', err);
});

module.exports = app;
