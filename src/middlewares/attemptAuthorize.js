const autorizacao = require('./autorizacao');

module.exports = (entity, action) => (req, res, next) => {
    if(req.authenticated === true){
        return autorizacao(entity, action)(req, res, next);
    }
    next();
}