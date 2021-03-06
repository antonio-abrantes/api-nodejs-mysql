const mysql = require('../mysql').pool;

exports.getPedidos = (req, res, next) => {
  mysql.getConnection((error, conn)=>{
    if(error){ return res.status(500).send({error: error}); }
    conn.query(
      `SELECT pedidos.id_pedido,
              pedidos.quantidade,
              produtos.id_produto,
              produtos.nome,
              produtos.preco 
          FROM pedidos
          INNER JOIN produtos
          ON produtos.id_produto = pedidos.id_produto
      `,
      (error, result, fields)=>{
        conn.release();
        const response = {
          quantidadePedidos: result.length,
          pedidos: result.map(pedido=>{
            return{
              id_pedido: pedido.id_pedido,
              id_produto: pedido.id_produto,
              quantidade: pedido.quantidade,
              produto: {
                id_produto: pedido.id_produto,
                nome: pedido.nome,
                preco: pedido.preco
              },
              request: {
                tipo: 'GET',
                descricao: '',
                url: process.env.URL_API+'produtos/'+pedido.id_produto
              }
            }
          })
        }
        return res.status(200).send({response: response});
      }
    )
  })
}

exports.postPedidos = (req, res, next) => {

  const {id_produto, quantidade } = req.body;
  
  mysql.getConnection((error, conn)=>{
    if(error){ return res.status(500).send({error: error}); }
    conn.query(
      'SELECT * FROM produtos WHERE id_produto = ?',
      [id_produto],
      (error, result, fields)=>{
        if(result.length == 0){
          return res.status(404).send({mensagem: 'Não existe referencia ao produto cadastrado'});
        }
        let produdo = result[0];
        conn.query(
          'INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?)',
          [ id_produto, quantidade ],
          (error, result, field)=>{
            conn.release();//Importante para liberar a conexão
            if(error){ return res.status(500).send({error: error, response: null}) }
            const response = {
              mensagem: 'Cadastrado com sucesso',
              pedidoCriado: {
                id_pedido: result.insertId,
                produto: produdo,
                quantidade: quantidade,
                request: {
                  tipo: 'POST',
                  descricao: '',
                  url: process.env.URL_API+'pedidos'
                } 
              }
            }
            return res.status(201).send({ response: response });
          }
        )
      }
    )
  });
}

exports.getPedidoPorId = (req, res, next) => {

  const id = req.params.id_pedido;

  mysql.getConnection((error, conn)=>{
    if(error){ return res.status(500).send({error: error}); }
    conn.query(
      'SELECT * FROM pedidos WHERE id_pedido = ?',
      [id],
      (error, result, fields)=>{
        conn.release();

        if(result.length == 0){
          return res.status(404).send({mensagem: 'ID não cadastrado'});
        }

        const response = {
          pedido: {
            id_pedido: result[0].id_pedido,
            id_produto: result[0].id_produto,
            quantidade: result[0].quantidade,
            request: {
              tipo: 'GET',
              descricao: '',
              url: process.env.URL_API+'produtos'
            } 
          }
        }
        return res.status(200).send({response: response});
      }
    )
  });
}

exports.deletePedido = (req, res, next) => {
  const id = req.params.id_pedido;

  mysql.getConnection((error, conn)=>{
    if(error){ return res.status(500).send({error: error}); }
    conn.query(
      'DELETE FROM pedidos WHERE id_pedido = ?',
      [id],
      (error, result, fields)=>{
        conn.release();
        const response = {
          mensagem: 'Removido com sucesso',
          request: {
            tipo: 'POST',
            descricao: '',
            url: process.env.URL_API+'pedidos',
            body:{
              "id_produto": "Number",
              "quantidade": "Number"
            }
          }
        }
        return res.status(202).send({response: response});
      }
    )
  });
}