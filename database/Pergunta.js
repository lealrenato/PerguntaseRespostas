const Sequelize = require("sequelize");
const connection = new require("./database");

const Pergunta = connection.define("perguntas", {
  titulo: {
    type: Sequelize.STRING, //texto curto
    AllowNull: false,
  },

  descricao: {
    type: Sequelize.TEXT, //texto longo
    AllowNull: false,
  },
});

Pergunta.sync({ force: false }) //caso a tebela ja exista não sera forçado a criação de uma nova
  .then(() => {});
  

  module.exports = Pergunta;
