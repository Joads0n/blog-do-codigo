const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

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

passport.use(
    /** Objeto de campos opcionais e função callback de verificação */
    new LocalStrategy({ 
        usernameField: 'email',
        passportField: 'password',
        session: false
    }, async (email, password, done) => {
        try {
            const user = await Usuario.buscaPorEmail(email);
            userVerification(user);
            passwordVerification(password, user.passwordHash);

            done(null, user);
        } catch (err){
            done(err);
        }
    })
)