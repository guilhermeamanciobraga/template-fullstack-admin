const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'common_user'),
        defaultValue: 'common_user',
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    login_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    lock_until: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = User;