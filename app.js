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




require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Tus rutas existentes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);


  

// Conexión con la base de datos
sequelize.sync().then(() => {
    console.log('Conexion exitosa a la base de datos');
}).catch(err => {
    console.error('Error al conectar con la base de datos', err);
});

module.exports = app;
