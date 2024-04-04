const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{

    const Tag = sequelize.define("Tag",{

        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        

        name:{
            type:DataTypes.STRING
        },


     
    });

    console.log("tagmodel")
    return Tag;
}