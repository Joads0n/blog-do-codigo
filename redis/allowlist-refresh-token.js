const redis = require('redis');
const manipulaLista = require('./manipula-list');

const allowlist = redis.createClient({ prefix: 'allowlist-refresh-token:' });

module.exports = manipulaLista(allowlist);