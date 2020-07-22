const express = require('express');
const { response } = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// Middleware de login
const login = require('../middleware/login');

//Controllers
const PedidosController = require('../controllers/pedidosController');

//Listagem
router.get('/', PedidosController.getPedidos );

//Inserção
router.post('/', login.obrigatorio, PedidosController.postPedidos );

//Retorno por id
router.get('/:id_pedido', PedidosController.getPedidoPorId );

//Exclusão por id
router.delete('/:id_pedido', login.obrigatorio, PedidosController.deletePedido );

//Alteração por id
// router.patch('/:id_pedido', (req, res, next) => {
//   res.status(201).send(
//     { mensagem: 'Rota de alteração de pedido' }
//   );
// });

module.exports = router;
