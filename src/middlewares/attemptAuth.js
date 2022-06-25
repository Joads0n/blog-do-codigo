const { middlewaresAuthentication } = require('../usuarios');

module.exports = (req, res, next) => {
    req.authenticated = false;
    
    if(req.get('Authorization')) {
        return middlewaresAuthentication.bearer(req, res, next);
    }
    next();
}