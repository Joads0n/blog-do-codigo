const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');
const { InvalidArgumentError } = require('../erros');
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token');
const blocklistAccessToken = require('../../redis/blocklist-acess-token');

function createTokenJWT(id, [amountTime, UnityTime]){
    const payload = { id: id};
    const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: amountTime + UnityTime });
    return token;
}

async function verifyTokenJWT(token, name, blocklist) {
    await verifyTokenBlocklist(token, name, blocklist);
    const { id } = jwt.verify(token, process.env.KEY_JWT);
    return id;
}

async function verifyTokenBlocklist(token, name, blocklist){
    const tokenBlocklist = await blocklist.containToken(token);
    if(tokenBlocklist){
        throw new jwt.JsonWebTokenError(`${name}Token invalid to lougout`);
    }
}

async function createRefreshToken(id, [amountTime, UnityTime], allowlist) {
    const refreshToken = crypto.randomBytes(24).toString('hex');
    const expirationDate = moment().add(amountTime, UnityTime).unix();
    await allowlist.addList(refreshToken, id, expirationDate);
    
    return refreshToken;
}

async function verifyRefreshToken(token, name, allowlist) {
    verifyTokenSend(token, name);
    const id = await allowlist.containKey(token);
    verifyTokenValid(id, name);
    return id;
}

function verifyTokenValid(id, name) {
    if (!id) {
        throw new InvalidArgumentError(`${name} is invalid`);
    }
}

function verifyTokenSend(token, name) {
    if (!token) {
        throw new InvalidArgumentError(`${name} not sent`);
    }
}

module.exports = {
    access: {
        name: 'access token',
        list: blocklistAccessToken,
        expiration: [15, 'm'],
        create(id) {
            return createTokenJWT(id, this.expiration);
        },
        verify(token) {
            return verifyTokenJWT(token, this.name, this.list);
        }
    },

    refresh: {
        name: 'refresh token',
        list: allowlistRefreshToken,
        expiration: [5, 'd'],
        create(id) {
            return createRefreshToken(id, this.expiration, this.list);
        },
        verify(token) {
            return verifyRefreshToken(token, this.name, this.list);
        }
    }
}



