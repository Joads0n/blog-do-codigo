const passport = require('passport');
const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError } = require('../erros');
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token');

async function verifyRefreshToken(refreshToken) {
    if(!refreshToken){
        throw new InvalidArgumentError('Refresh not sent');
    }
    const id = await allowlistRefreshToken.containKey(refreshToken);
    if(!id){
        throw new InvalidArgumentError('Refresh token is invalid'); 
    }
    return id;
}

async function invalidRefreshToken(refreshToken) {
    await allowlistRefreshToken.delete(refreshToken);
}

module.exports = {
    local: (req, res, next) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if(error && error.name === 'InvalidArgumentError'){
                return res.status(401).json({ error: error.message });
            }
            if(error){
                return res.status(500).json({ error: error.message });
            }
            if(!user){
                return res.status(401).json(); 
            }
            req.user = user;
            return next();
        })(req, res, next);
        
    },

    bearer:  (req, res, next) => {
        passport.authenticate(
            'bearer', 
            { session: false },
            (error, user, info) => {
                
                if(error && error.name === 'JsonWebTokenError'){
                    return res.status(401).json({ error: error.message });
                }

                if(error && error.name === 'TokenExpiredError'){
                    return res.status(401).json({ error: error.message, expiradoEm: error.expiredAt });
                }

                if(error){
                    return res.status(500).json({ error: error.message }); 
                }

                if(!user){
                    return res.status(401).json(); 
                }
                req.token = info.token;
                req.user = user;
                return next();
            }
        )(req, res, next);
    },

    refresh: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const id = await verifyRefreshToken(refreshToken);
            await invalidRefreshToken(refreshToken);
            req.user = await Usuario.buscaPorId(id);
            return next(); 
        } catch (err) {
            if(err.name === 'InvalidArgumentError'){
                return res.status(401).json({ Error: err.message });
            }
            return res.status(500).json({ Error: err.message });
        }
    }
} 