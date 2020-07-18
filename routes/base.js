const express = require('express');
const router = express.Router();

//Listagem
router.get('/', (req, res, next) => {
  res.status(200).send({ 
    mensagem: 'Rota de listagem' 
  });
});

//Inserção
router.post('/', (req, res, next) => {
  res.status(201).send(
    { mensagem: 'Rota de inserção' }
  );
});

//Retorno por id
router.get('/:id_entidade', (req, res, next) => {

  const id = req.params.id_produto;

  res.status(200).send({ 
    mensagem: 'Rota de retorno por id',
    id: id 
  });
});

//Alteração por id
router.patch('/:id_entidade', (req, res, next) => {
  res.status(201).send(
    { mensagem: 'Rota de alteração' }
  );
});


//Exclusão por id
router.delete('/:id_entidade', (req, res, next) => {
  res.status(201).send(
    { mensagem: 'Rota de exclusão por id' }
  );
});

module.exports = router;
