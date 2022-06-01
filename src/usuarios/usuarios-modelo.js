const usuariosDao = require('./usuarios-dao');
const { InvalidArgumentError } = require('../erros');
const validacoes = require('../validacoes-comuns');

const bcrypt = require('bcrypt');

class Usuario {
  constructor(usuario) {
    this.id = usuario.id;
    this.nome = usuario.nome;
    this.email = usuario.email;
    this.passwordHash = usuario.passwordHash;

    this.valida();
  }

  async adiciona() {
    if (await Usuario.buscaPorEmail(this.email)) {
      throw new InvalidArgumentError('O usuário já existe!');
    }

    return usuariosDao.adiciona(this);
  }

  valida() {
    validacoes.campoStringNaoNulo(this.nome, 'nome');
    validacoes.campoStringNaoNulo(this.email, 'email');
  }
  
  
  async deleta() {
    return usuariosDao.deleta(this);
  }
  
  static async buscaPorId(id) {
    const usuario = await usuariosDao.buscaPorId(id);
    if (!usuario) {
      return null;
    }
    
    return new Usuario(usuario);
  }
  
  static async buscaPorEmail(email) {
    const usuario = await usuariosDao.buscaPorEmail(email);
    if (!usuario) {
      return null;
    }
    
    return new Usuario(usuario);
  }

  static lista() {
    return usuariosDao.lista();
  }

  /** Função geradora de uma senha hash atrelada a um custo */
  static generatePasswordHash(password) {
    const custoHash = 12;
    return bcrypt.hash(password, custoHash);
  }

  async addPassword(password){
    validacoes.campoStringNaoNulo(password, 'senha');
    validacoes.campoTamanhoMinimo(password, 'senha', 8);
    validacoes.campoTamanhoMaximo(password, 'senha', 64);
    
    this.passwordHash = await Usuario.generatePasswordHash(password);
  }
}

module.exports = Usuario;
