const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna todos os produtos
router.get('/', (req, res, next) => {
  // res.status(200).send({ mensagem: 'Rota de produtos' });
  mysql.getConnection((error, conn)=>{
    if(error){ return res.status(500).send({error: error}); }
    conn.query(
      'SELECT * FROM produtos',
      (error, resultado, fields)=>{
        conn.release();
        return res.status(200).send({response: resultado});
      }
    )
  });
});

//Insere um produto
router.post('/', (req, res, next) => {

  const produto = {
    nome: req.body.nome,
    preco: req.body.preco
  }

  mysql.getConnection((error, conn)=>{
    conn.query(
      'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
      [produto.nome, produto.preco],
      (error, resultado, field)=>{
        conn.release();//Importante para liberar a conexão
        if(error){
          return res.status(500).send({error: error, response: null})
        }
        return res.status(201).send(
          { mensagem: 'Cadastrado com sucesso',
            id_produto: resultado.insertId
          }
        );
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
      (error, resultado, fields)=>{
        conn.release();
        return res.status(200).send({response: resultado});
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
      (error, resultado, fields)=>{
        conn.release();
        return res.status(202).send({response: "Alterado com sucesso"});
      }
    )
  });
});


//Insere um produto
router.delete('/:id_produto', (req, res, next) => {
  const id = req.params.id_produto;

  mysql.getConnection((error, conn)=>{
    if(error){ return res.status(500).send({error: error}); }
    conn.query(
      'DELETE FROM produtos WHERE id_produto = ?',
      [id],
      (error, resultado, fields)=>{
        conn.release();
        return res.status(202).send({msg:"Removido com sucesso", response: resultado});
      }
    )
  });
});

module.exports = router;
