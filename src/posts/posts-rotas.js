const postsControlador = require('./posts-controlador');
const { middlewaresAuthentication } = require('../usuarios');

module.exports = app => {
  app
    .route('/post')
    .get(postsControlador.lista)
    .post(middlewaresAuthentication.bearer, postsControlador.adiciona);
};
