const express = require('express');
const { response } = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    cb(null, new Date().toISOString().replace(/:/g, '-') + "_" +file.originalname);
  }
});

const fileFilter = (req, file, cb)=>{
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
    cb(null, true);
  }else{
    cb(null, false);
  }
}

const upload = multer({ 
  storage: storage,
  limits:{
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter 
});

//Retorna todos os produtos
router.get('/', (req, res, next) => {
  // res.status(200).send({ mensagem: 'Rota de produtos' });
  mysql.getConnection((error, conn)=>{
    if(error){ return res.status(500).send({error: error}); }
    conn.query(
      'SELECT * FROM produtos',
      (error, result, fields)=>{
        conn.release();
        const response = {
          quantidade: result.length,
          produtos: result.map(prod=>{
            return{
              id_produto: prod.id_produto,
              nome: prod.nome,
              preco: prod.preco,
              imagem_produto: prod.imagem_produto,
              request: {
                tipo: 'GET',
                descricao: '',
                url: 'http://localhost:3333/produtos/'+prod.id_produto
              }
            }
          })
        }
        return res.status(200).send({response: response});
      }
    )
  });
});

//Insere um produto
router.post('/', upload.single('imagem_produto'), (req, res, next) => {

  if(typeof req.file === 'undefined'){
    return res.status(404).send({ response: "Arquivo vazio ou formato invalido" });
  }
  console.log(req.file.filename);

  const produto = {
    nome: req.body.nome,
    preco: req.body.preco,
    imagem_produto: req.file.path.replace(/\\/g, '/')
  }

  //return res.status(201).send({ response: produto });

  mysql.getConnection((error, conn)=>{
    conn.query(
      'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?, ?, ?)',
      [produto.nome, produto.preco, produto.imagem_produto],
      (error, result, field)=>{
        conn.release();//Importante para liberar a conexão
        if(error){ return res.status(500).send({error: error, response: null}) }
        const response = {
          mensagem: 'Cadastrado com sucesso',
          produtoCriado: {
            id_produto: result.insertId,
            nome: produto.nome,
            preco: produto.preco,
            imagem_produto: produto.imagem_produto,
            request: {
              tipo: 'POST',
              descricao: '',
              url: 'http://localhost:3333/produtos'
            } 
          }
        }
        return res.status(201).send({ response: response });
      }
    )
  });
});

//Retorna um produto especifico
router.get('/:id_produto', (req, res, next) => {

  const id = req.params.id_produto;

  mysql.getConnection((error, conn)=>{
    if(error){ return res.status(500).send({error: error}); }
    conn.query(
      'SELECT * FROM produtos WHERE id_produto = ?',
      [id],
      (error, result, fields)=>{
        conn.release();

        if(result.length == 0){
          return res.status(404).send({mensagem: 'ID não cadastrado'});
        }

        const response = {
          produto: {
            id_produto: result[0].id_produto,
            nome: result[0].nome,
            preco: result[0].preco,
            imagem_produto: result[0].imagem_produto,
            request: {
              tipo: 'GET',
              descricao: '',
              url: 'http://localhost:3333/produtos'
            } 
          }
        }
        return res.status(200).send({response: response});
      }
    )
  });
});

//Altera um produto
router.patch('/', (req, res, next) => {
  const {id_produto, nome, preco } = req.body;

  console.log(id_produto + " - "+nome );

  mysql.getConnection((error, conn)=>{
    if(error){ return res.status(500).send({error: error}); }
    conn.query(
      `UPDATE produtos 
       SET  nome  = ?,
            preco = ?
        WHERE id_produto = ?`,
      [nome, preco, id_produto],
      (error, result, fields)=>{
        conn.release();
        const response = {
          produtoAtualizado: {
            id_produto: id_produto,
            nome: nome,
            preco: preco,
            request: {
              tipo: 'GET',
              descricao: '',
              url: 'http://localhost:3333/produtos'
            } 
          }
        }
        return res.status(202).send({response: response});
      }
    )
  });
});


//Deleta um produto
router.delete('/:id_produto', (req, res, next) => {
  const id = req.params.id_produto;

  mysql.getConnection((error, conn)=>{
    if(error){ return res.status(500).send({error: error}); }
    conn.query(
      'DELETE FROM produtos WHERE id_produto = ?',
      [id],
      (error, result, fields)=>{
        conn.release();
        const response = {
          mensagem: 'Removido com sucesso',
          request: {
            tipo: 'POST',
            descricao: '',
            url: 'http://localhost:3333/produtos',
            body:{
              "nome": "String",
              "preco": "Number"
            }
          }
        }
        return res.status(202).send({response: response});
      }
    )
  });
});

module.exports = router;
