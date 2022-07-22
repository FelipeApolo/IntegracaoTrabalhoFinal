const db=require('./db')
const Cadastro= db.sequelize.define('cadastros',{
    id: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome:{
        type:db.Sequelize.STRING
    },
    email:{
        type:db.Sequelize.STRING
    },
    senha:{
        type:db.Sequelize.STRING
    }
})

module.exports=Cadastro