const control = require('../accessControl');

const methods = {
    read: {
        all: 'readAny',
        your: 'readOwn'
    },
    create : {
        all: 'createAny',
        your: 'createOwn'
    },
    remove : {
        all: 'deleteAny',
        your: 'deleteOwn'
    }
}

module.exports = (entity, action) => (req, res, next) => {
    const permissionsRole = control.can(req.user.role);
    
    const actions = methods[action]

    const permissionAll = permissionsRole[actions.all](entity);
    const permissionJustYour = permissionsRole[actions.your](entity);
    
    if(permissionAll.granted === false && permissionJustYour.granted === false){
        res.status(403).send('Rota bloqueada por permição');
        return
    }

    req.access = {
        all: {
            permited: permissionAll.granted,
            attributes: permissionAll.attributes
        },
        your: {
            permited: permissionJustYour.granted,
            attributes: permissionJustYour.attributes
        }
    }
    next();
}