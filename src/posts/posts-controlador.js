const Post = require('./posts-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');

module.exports = {
  adiciona: async (req, res) => {
    try {
      const post = new Post(req.body);
      await post.adiciona();
      
      res.status(201).send(post);
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  lista: async (req, res) => {
    try {
      let posts = await Post.lista();

      if(!req.authenticated){
        posts = posts.map(post => ({titulo: post.titulo}));
      }
      
      res.send(posts);
    } catch (erro) {
      return res.status(500).json({ erro: erro });
    }
  }
};
