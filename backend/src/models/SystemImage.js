const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SystemImage = sequelize.define('SystemImage', {
    type: {
        type: DataTypes.ENUM('logo', 'favicon'),
        allowNull: false,
        unique: true,
        validate: {
            isIn: {
                args: [['logo', 'favicon']],
                msg: "O tipo deve ser 'logo' ou 'favicon'."
            }
        }
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${process.env.APP_URL}/files/logo-favicon/${this.path}`;
        }
    }
}, {
    tableName: 'system_images',
    underscored: true
});

module.exports = SystemImage;