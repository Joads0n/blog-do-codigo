const AccessControl = require('accesscontrol');
const control = new AccessControl()

control
    .grant('subscriber')
    .readAny('post', ['id', 'titulo', 'conteudo'])

control
    .grant('editor')
    .extend('subscriber')
    .createOwn('post')
    .deleteOwn('post')             /** A API no momento não implementa o metodo de deletar o post */

control
    .grant('admin')
    .createAny('post')
    .deleteAny('post')
    .readAny('usuario')
    .deleteAny('usuario')

module.exports = control;