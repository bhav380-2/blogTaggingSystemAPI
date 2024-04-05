const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {

    const Tag = sequelize.define("Tag", {

        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        tagName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

    },

    {
        indexes: [
            {
                fields: ['tagName'],
            }
        ]
    });

    console.log("tagmodel")
    return Tag;
}