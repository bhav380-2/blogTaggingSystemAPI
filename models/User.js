const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{

    const User = sequelize.define("User",{

        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            allowNull: false,
            autoIncrement:true
        },

        name:{
            type:DataTypes.STRING
        },

        email:{
            type:DataTypes.STRING
        },

        password:{
            type:DataTypes.STRING
        },

        role:{
            type:DataTypes.STRING
        }
     
    });

    return User;
}