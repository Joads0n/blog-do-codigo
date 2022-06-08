const blacklist = require('./blacklist');
const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');

const { promisify } = require('util');

const existsAsync = promisify(blacklist.exists).bind(blacklist)

const setAsync = promisify(blacklist.set).bind(blacklist);

function createTokenHash(token) {
    return createHash('sha256').update(token).digest('hex');
}

module.exports = {
    addTokenBlacklist: async token => {
        const expirationDate = jwt.decode(token).exp;      /** Decodificando o payload do token e pegando o timestamp de expiração */
        const tokenHash = createTokenHash(token);
        await setAsync(tokenHash, '');                       /** Adiciona o hash do token no redis */
        blacklist.expireat(tokenHash, expirationDate);       /** Expira o token após ele ser adicionado e após expirationDate chegar ao fim */
    },

    containToken: async token => {
        const tokenHash = createTokenHash(token);
        const result = await existsAsync(tokenHash);        /** Consulta a chave e retorna se existe ou não 0 ou 1 */
        return result === 1;
    }
}