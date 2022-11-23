//import de bibliotacas
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
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
  Pergunta.findAll({
    raw: true,
    order: [
      [
        "id",
        "DESC", // ASC = ascendente  ||  DESC = descendente
      ],
    ],
  }).then((perguntas) => {
    res.render("index", {
      perguntas: perguntas,
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
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta != undefined) {
      Resposta.findAll({
        raw: true,
        order: [
          [
            "id",
            "ASC", // ASC = ascendente  ||  DESC = descendente
          ],
        ],
        where: { perguntaId: pergunta.id },
      }).then((respostas) => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas,
        });
      });
    } else {
      res.redirect("/");
    }
  });
});

app.post("/responder", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId,
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId);
  });
});

app.listen(4000, () => {
  console.log("app rodando");
});
