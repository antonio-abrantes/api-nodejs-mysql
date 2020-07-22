const express = require('express');
const { response } = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');

// Middleware de login
const login = require('../middleware/login');

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

const ProdutosController = require('../controllers/produtosController');

//Retorna todos os produtos
router.get('/', ProdutosController.getProdutos );

//Insere um produto
router.post('/', login.obrigatorio, upload.single('imagem_produto'), ProdutosController.postProdutos);

//Retorna um produto especifico
router.get('/:id_produto', ProdutosController.getProdutoPorId);

//Altera um produto
router.patch('/', login.obrigatorio, ProdutosController.updateProduto );

//Deleta um produto
router.delete('/:id_produto', login.obrigatorio, ProdutosController.deleteProduto );

module.exports = router;