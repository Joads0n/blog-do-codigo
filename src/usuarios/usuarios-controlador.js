const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const jwt = require('jsonwebtoken');
const blacklist = require('../../redis/manipula-blacklist');
const crypto = require('crypto');
const moment = require('moment');
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token');


function createTokenJWT(user){
  const payload = {
    id: user.id
  };

  const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: '15m' });
  return token;
}

async function createRefreshToken(user) {
  const refreshToken = crypto.randomBytes(24).toString('hex');
  const expirationDate = moment().add(5, 'd').unix();
  await allowlistRefreshToken.addList(refreshToken, user.id, expirationDate);
  
  return refreshToken;
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
      });
      await usuario.addPassword(senha)
      await usuario.adiciona();

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
      const acessToken = createTokenJWT(req.user);
      const refreshToken = await createRefreshToken(req.user);
      res.set('Authorization', acessToken);
      console.log({refreshToken})
      res.status(200).json();
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },
  
  logout: async (req, res) => {
    try {
      const token = req.token;
      await blacklist.addTokenBlacklist(token);
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
