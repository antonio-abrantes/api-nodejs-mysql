require("dotenv").config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//Para tornar a pasta pública
app.use('/uploads', express.static('uploads'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configuração do CORS
app.use((req, res, next) => {
  res.header('Acces-Control-Allow-Origin', '*');
  res.header('Acces-Control-Allow-Header',
      'Origin, X-Requrested-With, Content-Type, Accept, Authorization'
  );
  if(req.method === "OPTIONS"){
    res.header('Acces-Control-Allow-Methods', 'PUT, POTS, PATCH, DELETE, GET');
    return res.status(200).send({ok: "ok"});
  }
  next();
});

//Rotas
const rotaProdutos = require('./routes/produtos');
app.use('/produtos', rotaProdutos);

const rotaPedidos = require('./routes/pedidos');
app.use('/pedidos', rotaPedidos);

const rotaUsuarios = require('./routes/usuarios');
app.use('/usuarios', rotaUsuarios);

//Rota de erro
app.use((req, res, next) => {

  const erro = new Error("Rota não encontrada");
  erro.status = 404;
  next(erro);

});

app.use((error, req, res, next) => {
  
  res.status(error.status || 500);
  
  return res.send({
    erro: {
      mensagem: error.message
    }
  });
});

app.use('/teste',(req, res, next) => {
  res.status(200).send({
    mensagem: "Funcionando"
  });
});


module.exports = app;