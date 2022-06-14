const redis = require('redis');
const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');
const manipulaLista = require('./manipula-list');

const blocklist = redis.createClient({ prefix: 'blocklist-acess-token:' });
const manipulaBlocklist = manipulaLista(blocklist)

function createTokenHash(token) {
    return createHash('sha256').update(token).digest('hex');
}

module.exports = {
    addTokenBlocklist: async token => {
        const expirationDate = jwt.decode(token).exp;      /** Decodificando o payload do token e pegando o timestamp de expiração */
        const tokenHash = createTokenHash(token);
        await manipulaBlocklist.addList(tokenHash, '', expirationDate);       /** Expira o token após ele ser adicionado e após expirationDate chegar ao fim */
    },

    containToken: async token => {
        const tokenHash = createTokenHash(token);
        return manipulaBlocklist.containKey(tokenHash);
    }
}