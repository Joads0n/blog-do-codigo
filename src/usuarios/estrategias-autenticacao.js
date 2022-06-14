const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken');
const blocklist = require('../../redis/blocklist-acess-token');

const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError } = require('../erros');

function userVerification(user) {
    if(!user){
        throw new InvalidArgumentError('Não existe usuário com esse e-mail.');
    }
}

async function passwordVerification(password, passwordHash) {
    const validPassword = await bcrypt.compare(password, passwordHash);
    if(!validPassword){
        throw new InvalidArgumentError('E-mail ou senha inválidos.');
    }
}

async function verifyTokenBlocklist(token){
    const tokenBlocklist = await blocklist.containToken(token)
    if(tokenBlocklist){
        throw new jwt.JsonWebTokenError('Token inválido por lougout');
    }
}

passport.use(
    /** Objeto de campos opcionais e função callback de verificação */
    new LocalStrategy({ 
        usernameField: 'email',
        passwordField: 'password',
        session: false
    }, async (email, password, done) => {
        try {
            const user = await Usuario.buscaPorEmail(email);
            userVerification(user);
            await passwordVerification(password, user.passwordHash);

            done(null, user);
        } catch (err){
            done(err);
        }
    })
)

passport.use(
    /* Função de verificação do token */
    new BearerStrategy( async (token, done) => {
        try {
            await verifyTokenBlocklist(token);
            const payload = jwt.verify(token, process.env.KEY_JWT);
            const user = await Usuario.buscaPorId(payload.id);
            
            done(null, user, { token: token });
        } catch (err) {
            done(err);
        }
    })
)