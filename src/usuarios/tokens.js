const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token');

function createTokenJWT(id, [amountTime, UnityTime]){
    const payload = { id: id};
    const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: amountTime + UnityTime });
    return token;
}
  
async function createRefreshToken(id, [amountTime, UnityTime], allowlist) {
    const refreshToken = crypto.randomBytes(24).toString('hex');
    const expirationDate = moment().add(amountTime, UnityTime).unix();
    await allowlist.addList(refreshToken, id, expirationDate);
    
    return refreshToken;
}

module.exports = {
    access: {
        expiration: [15, 'm'],
        create(id) {
            return createTokenJWT(id, this.expiration);
        }
    },

    refresh: {
        list: allowlistRefreshToken,
        expiration: [5, 'd'],
        create(id) {
            return createRefreshToken(id, this.expiration, this.list);
        }
    }
}

