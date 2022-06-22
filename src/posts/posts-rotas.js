const postsControlador = require('./posts-controlador');
const { middlewaresAuthentication } = require('../usuarios');
const autorizacao = require('../middlewares/autorizacao');

module.exports = app => {
  app
    .route('/post')
    .get(postsControlador.lista)
    .post(middlewaresAuthentication.bearer, autorizacao(['admin', 'editor']), postsControlador.adiciona);
};
