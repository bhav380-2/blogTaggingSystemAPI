const { sequelize } = require(".");


module.exports = (sequelize,DataTypes)=>{

    const Blog = sequelize.define("Blog",{
        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        
        author:{
            type:DataTypes.STRING

        },

        title:{
            type:DataTypes.STRING
        },

        content:{
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },

    });

    return Blog;
}