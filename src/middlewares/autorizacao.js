module.exports = (cargoObrigatorios) => (req, res, next) => {
    if(cargoObrigatorios.indexOf(req.user.role) === -1){
        return res.status(403).send('Rota bloqueada por permição');
    }
    next();
}