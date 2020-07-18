const express = require('express');
const router = express.Router();

//Listagem
router.get('/', (req, res, next) => {
  res.status(200).send({ 
    mensagem: 'Rota de listagem de pedidos' 
  });
});

//Inserção
router.post('/', (req, res, next) => {
  res.status(201).send(
    { mensagem: 'Rota de inserção de pedido' }
  );
});

//Retorno por id
router.get('/:id_pedido', (req, res, next) => {

  const id = req.params.id_produto;

  res.status(200).send({ 
    mensagem: 'Rota de retorno de pedido por id',
    id: id 
  });
});

//Alteração por id
router.patch('/:id_pedido', (req, res, next) => {
  res.status(201).send(
    { mensagem: 'Rota de alteração de pedido' }
  );
});


//Exclusão por id
router.delete('/:id_pedido', (req, res, next) => {
  res.status(201).send(
    { mensagem: 'Rota de exclusão de pedido por id' }
  );
});

module.exports = router;
