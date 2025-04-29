const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'diseñador',   // Puedes definir el rol por defecto aquí
        validate: {
            isIn: [['admin', 'colaborador', 'diseñador']]  // Solo estos roles son válidos
        }
    }
}, {
    tableName: 'users',
    timestamps: true,
});

User.associate = (models) => {
    User.hasMany(models.Project, {
        foreignKey: 'userId',
        as: 'projects',
    });
};


module.exports = User;