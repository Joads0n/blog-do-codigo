const usuariosControlador = require('./usuarios-controlador');
const middlewaresAuthentication = require('./middlewares-autenticacao');
const passport = require('passport')
module.exports = app => {
  app
    .route('/usuario/login')
    .post(middlewaresAuthentication.local, usuariosControlador.login);   /** Middleware de autenticação */
  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app.route('/usuario/:id').delete(passport.authenticate('bearer', { session: false }), usuariosControlador.deleta);
};
