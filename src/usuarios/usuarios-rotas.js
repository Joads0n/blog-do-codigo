const usuariosControlador = require('./usuarios-controlador');
const middlewaresAuthentication = require('./middlewares-autenticacao');
const autorizacao = require('../middlewares/autorizacao');

module.exports = app => {
  app
    .route('/usuario/atualiza_token')
    .post(middlewaresAuthentication.refresh, usuariosControlador.login);  /** O metodo login já gera um acess token e um refresh token */
  app
    .route('/usuario/verifica_email/:token')
    .get(middlewaresAuthentication.verificationEmail, usuariosControlador.emailVerify)
  app
    .route('/usuario/login')
    .post(middlewaresAuthentication.local, usuariosControlador.login);   /** Middleware de autenticação */
  app
    .route('/usuario/logout')
    .post([middlewaresAuthentication.refresh, middlewaresAuthentication.bearer], usuariosControlador.logout);
  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(
      [middlewaresAuthentication.bearer, autorizacao('usuario', 'read')],
      usuariosControlador.lista
    );

  app.route('/usuario/:id').delete([middlewaresAuthentication.bearer,  middlewaresAuthentication.local, autorizacao('usuario', 'remove')], usuariosControlador.deleta);
};
