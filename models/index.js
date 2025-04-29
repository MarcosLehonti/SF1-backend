const sequelize = require('../config/db');
const User = require('./User');
const Project = require('./Project');

// Asociaciones
User.associate({ Project });
Project.associate({ User });

const db = {
  sequelize,
  User,
  Project,
};

module.exports = db;
