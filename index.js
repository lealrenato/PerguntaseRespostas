//import de bibliotacas
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
//database

connection
  .authenticate()
  .then(() => {
    console.log("conexão feita com o banco de dados!");
  })
  .catch((msgerro) => {
    console.log("ocorreu um erro: " + msgerro);
  });

//definir view engine como ejs
app.set("view engine", "ejs");
app.use(express.static("public"));

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //para api

//rotas
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true,order:[
[
  'id','DESC'// ASC = ascendente  ||  DESC = descendente
]

  ] 
}).then(perguntas => {
    res.render("index",{
      perguntas: perguntas
    });
    
  });
  
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;
  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id;
  Pergunta.findOne({
    where: {id: id}
  }).then(pergunta =>{
    
    if (pergunta != undefined) {
      res.render("pergunta",{pergunta:pergunta});
    } else {
      res.redirect("/");
    }

  });
})

app.listen(4000, () => {
  console.log("app rodando");
});
