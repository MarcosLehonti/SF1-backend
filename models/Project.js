const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    codigo: {
        type: DataTypes.TEXT('long'), // para strings HTML largos
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // referencia a la tabla users
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'projects',
    timestamps: true,
});

// 🚨 Agrega esta función para evitar el error:
Project.associate = (models) => {
    Project.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
    });
};

module.exports = Project;
