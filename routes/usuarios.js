const express = require('express');
const router = express.Router();

//Controllers
const UsuariosController = require('../controllers/usuariosController');

//Listagem
router.get('/', UsuariosController.index );

//Inserção
router.post('/cadastro', UsuariosController.cadastrarUsuario );

//Autenticação
router.post('/login', UsuariosController.login );

module.exports = router;
