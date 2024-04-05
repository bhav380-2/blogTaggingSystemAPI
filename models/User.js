const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("User", {

        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user'
        }

    },

    {
        indexes: [
            {
                fields: ['name']
            },
        ]
    }
    
    );

    return User;
}