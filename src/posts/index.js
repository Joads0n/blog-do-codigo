const middlewaresAutenticacao = require('../usuarios/middlewares-autenticacao');

module.exports = {
  modelo: require('./posts-modelo'),
  rotas: require('./posts-rotas'),
  controlador: require('./posts-controlador')
  };
