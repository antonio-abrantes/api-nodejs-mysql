const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

//Listagem
router.get('/', (req, res, next) => {
  res.status(200).send({ 
    mensagem: 'Rota de listagem' 
  });
});

//Inserção
router.post('/cadastro', (req, res, next) => {

  mysql.getConnection((error, conn)=>{
    if(error){ return res.status(500).send({error: error}); }

    conn.query(
      `SELECT * FROM usuarios WHERE email = ?`,
      [req.body.email],
      (error, result, fields)=>{
        if(result.length > 0){
          return res.status(409).send({mensagem: "Usuário já cadastrado"});
        }else{
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash)=>{
            if(errBcrypt){
              return res.status(500).send({error: errBcrypt});
            }
            conn.query(
              `INSERT INTO usuarios (email, senha) VALUES (?, ?)`,
              [req.body.email, hash],
              (error, result, fields)=>{
                  conn.release();
                  const response = {
                    mensagem: 'Usuario criado com sucesso!',
                    usuarioCriado: {
                      id_usuario: result.insertId,
                      email: req.body.email
                    }  
                  }
                return res.status(201).send({response: response});
              }
            )
          });
        }
      }
    )
  });
});

module.exports = router;
