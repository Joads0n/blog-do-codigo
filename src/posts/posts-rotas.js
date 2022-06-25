const postsControlador = require('./posts-controlador');
const { middlewaresAuthentication } = require('../usuarios');
const autorizacao = require('../middlewares/autorizacao');
const attempAuth = require('../middlewares/attemptAuth');
const attemptAuthorize = require('../middlewares/attemptAuthorize');

module.exports = app => {
  app
    .route('/post')
    .get(
      [attempAuth, attemptAuthorize('post', 'read')], 
      postsControlador.lista
    )
    .post(
      [middlewaresAuthentication.bearer, autorizacao('post', 'create')],
      postsControlador.adiciona
    );
};
