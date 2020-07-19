### Tratamento de erros
 - npm install --save morgan
 - npm install --save body-parser
 - npm install --save mysql

 ### Upload de imagens
  - npm install --save multer@1.4.2
  ```
    //no main da aplicação
    app.use('/uploads', express.static('uploads'));

    //Nas rotas
    const multer = require('multer');

    const storage = multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, './uploads/');
      },
      filename: function(req, file, cb){
        // O replace só é necessário no Windows
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

    router.post('/', upload.single('product_image'), (req, res, next)...
  ```