const { sequelize } = require(".");


module.exports = (sequelize, DataTypes) => {

    const Blog = sequelize.define("Blog", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,

        },

        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

    },

    {
        indexes: [
            {
                fields: ['createdAt']
            },
        ]
    });

    return Blog;
}