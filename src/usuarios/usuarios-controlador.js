const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const tokens = require('./tokens');
const { VerificationEmail } = require('./email');

function generateAddress(route, token) {
  const base = process.env.BASE_URL;
  return `${base}${route}${token}`;
}

module.exports = {
  adiciona: async (req, res, next) => {
    const { nome, email, senha, role } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerified: false,
        role
      });

      await usuario.addPassword(senha)
      await usuario.adiciona();

      const token = tokens.verifyEmail.create(usuario.id);

      const address = generateAddress('/usuario/verifica_email/', token);
      const verificationEmail = new VerificationEmail(usuario, address);
      verificationEmail.sendEmail().catch(console.log)

      res.status(201).json();
    } catch (error) {
      /*
        if (erro instanceof InvalidArgumentError) {
          res.status(422).json({ erro: erro.message });
        } else if (erro instanceof InternalServerError) {
          res.status(500).json({ erro: erro.message });
        } else {
          res.status(500).json({ erro: erro.message });
        }
      */
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const acessToken = tokens.access.create(req.user.id);
      const refreshToken = await tokens.refresh.create(req.user.id);
      res.set('Authorization', acessToken);
      res.status(200).json({refreshToken});
      //res.status(200).json();
    } catch (error) {
      next(error);
    }
  },
  
  logout: async (req, res, next) => {
    try {
      const token = req.token;
      await tokens.access.invalid(token);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  lista: async (req, res, next) => {
    try {
      const usuarios = await Usuario.lista();
      res.json(usuarios);
    } catch (error) {
      next(error);
    }
  },

  async emailVerify(req, res, next) {
    try {
      const user = req.user;
      console.log({user})
      await user.verifyEmail();
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },

  deleta: async (req, res, next) => {
    const usuario = req.user;
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
};
