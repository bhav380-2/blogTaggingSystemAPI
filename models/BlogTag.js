const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{

    const BlogTag = sequelize.define("BlogTag",{

        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        }
    });

    return BlogTag;
}