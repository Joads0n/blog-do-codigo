const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const tokens = require('./tokens');
const { VerificationEmail } = require('./email');

function generateAddress(route, userId) {
  const base = process.env.BASE_URL;
  return `${base}${route}${userId}`;
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerified: false
      });

      await usuario.addPassword(senha)
      await usuario.adiciona();

      const address = generateAddress('/usuario/verifica_email/', usuario.id);
      const verificationEmail = new VerificationEmail(usuario, address);
      verificationEmail.sendEmail().catch(console.log)

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  async login(req, res) {
    try {
      const acessToken = tokens.access.create(req.user.id);
      const refreshToken = await tokens.refresh.create(req.user.id);
      res.set('Authorization', acessToken);
      res.status(200).json({refreshToken});
      //res.status(200).json();
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },
  
  logout: async (req, res) => {
    try {
      const token = req.token;
      await tokens.access.invalid(token);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  }
};
