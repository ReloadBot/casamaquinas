// Controlador de autenticação atualizado para Sequelize
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const { generateToken } = require('../utils/auth');
const logger = require('../utils/logger');

const register = async (req, res) => {
  // Aceitar tanto 'senha' quanto 'password'
  const { nome, email, senha, password, tipo, cpf, telefone, endereco, cidade, estado, cep } = req.body;
  const senhaFinal = senha || password; // Aceitar qualquer um dos campos
  
  if (!senhaFinal) {
    return res.status(400).json({ msg: 'Por favor, forneça uma senha' });
  }
  
  try {
    // Verificar se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }
    
    // Criar novo usuário
    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaFinal, // O hook beforeCreate no modelo fará o hash
      tipo: tipo || 'cliente'
    });
    
    // Se for cliente, criar registro na tabela de clientes
    if (tipo === 'cliente' || !tipo) {
      try {
        await Cliente.create({
          usuario_id: usuario.id,
          cpf: cpf || null,
          telefone: telefone || null,
          endereco: endereco || null,
          cidade: cidade || null,
          estado: estado || null,
          cep: cep || null
        });
      } catch (clienteErr) {
        // Se houver erro ao criar o cliente, remover o usuário criado
        await usuario.destroy();
        logger.error(`Erro ao criar cliente: ${clienteErr.message}`);
        return res.status(400).json({ msg: 'Erro ao criar perfil de cliente', error: clienteErr.message });
      }
    }
    
    // Gerar token JWT
    const token = generateToken(usuario.id, usuario.tipo);
    
    res.status(201).json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (err) {
    logger.error(`Erro ao registrar usuário: ${err.message}`);
    res.status(500).json({ msg: 'Erro no servidor', error: err.message });
  }
};

const login = async (req, res) => {
  // Aceitar tanto 'senha' quanto 'password'
  const { email, senha, password } = req.body;
  const senhaFinal = senha || password; // Aceitar qualquer um dos campos
  
  if (!email || !senhaFinal) {
    return res.status(400).json({ msg: 'Por favor, forneça email e senha' });
  }
  
  try {
    // Buscar usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }
    
    // Verificar senha
    const isMatch = await usuario.compararSenha(senhaFinal);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }
    
    // Atualizar último acesso
    await usuario.update({ ultimo_acesso: new Date() });
    
    // Gerar token JWT
    const token = generateToken(usuario.id, usuario.tipo);
    
    res.json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (err) {
    logger.error(`Erro ao fazer login: ${err.message}`);
    res.status(500).json({ msg: 'Erro no servidor', error: err.message });
  }
};

const getUsuario = async (req, res) => {
  try {
    // Buscar usuário pelo ID
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['senha'] }
    });
    
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    
    res.json(usuario);
  } catch (err) {
    logger.error(`Erro ao obter usuário: ${err.message}`);
    res.status(500).json({ msg: 'Erro no servidor', error: err.message });
  }
};

const updateUsuario = async (req, res) => {
  // Aceitar tanto 'senha' quanto 'password'
  const { nome, email, senha, password } = req.body;
  const senhaFinal = senha || password; // Aceitar qualquer um dos campos
  
  try {
    // Buscar usuário pelo ID
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    
    // Verificar se o email já está em uso por outro usuário
    if (email && email !== usuario.email) {
      const existingUser = await Usuario.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email já está em uso' });
      }
    }
    
    // Atualizar dados do usuário
    await usuario.update({
      nome: nome || usuario.nome,
      email: email || usuario.email,
      senha: senhaFinal || undefined // Se não fornecido, não atualiza
    });
    
    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    });
  } catch (err) {
    logger.error(`Erro ao atualizar usuário: ${err.message}`);
    res.status(500).json({ msg: 'Erro no servidor', error: err.message });
  }
};

module.exports = {
  register,
  login,
  getUsuario,
  updateUsuario
};
