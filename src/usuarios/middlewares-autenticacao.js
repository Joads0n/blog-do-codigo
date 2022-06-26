const passport = require('passport');
const Usuario = require('./usuarios-modelo');
const tokens = require('./tokens');

module.exports = {
    local: (req, res, next) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            
            if(error){
                return next(error);
            }
            
            req.user = user;
            req.authenticated = true;
            return next();
        })(req, res, next);
        
    },

    bearer:  (req, res, next) => {
        passport.authenticate(
            'bearer', 
            { session: false },
            (error, user, info) => {

                if(error){
                    return next(error); 
                }

                req.token = info.token;
                req.user = user;
                req.authenticated = true;
                return next();
            }
        )(req, res, next);
    },

    refresh: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const id = await tokens.refresh.verify(refreshToken);
            await tokens.refresh.invalid(refreshToken);
            req.user = await Usuario.buscaPorId(id);
            return next(); 
        } catch (error) {
            if(error){
                return next(error);
            }
        }
    },

    verificationEmail: async (req, res, next) => {
        try {
            const { token } = req.params;
            const id = await tokens.verifyEmail.verify(token);
            const user = await Usuario.buscaPorId(id);
            req.user = user;
            next();
        } catch (error) {
            if(error){
                return next(error);
            }
        }
    }
} 